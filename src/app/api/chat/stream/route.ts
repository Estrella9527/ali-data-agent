import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { agentClient } from '@/lib/agent-client';
import { errors } from '@/lib/api-response';

// POST /api/chat/stream - Stream chat response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, dataSourceIds } = body;

    if (!sessionId || !message) {
      return errors.badRequest('sessionId and message are required');
    }

    // Save user message
    await prisma.message.create({
      data: {
        sessionId,
        role: 'user',
        content: message,
      },
    });

    // Get session context
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        dataContexts: true,
      },
    });

    if (!session) {
      return errors.notFound('Session');
    }

    // Get relevant memories
    const memories = await prisma.memory.findMany({
      where: { status: 'active' },
      orderBy: { heat: 'desc' },
      take: 5,
    });

    // Create streaming response
    const encoder = new TextEncoder();
    let fullContent = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const agentStream = agentClient.streamChat({
            sessionId,
            message,
            dataSourceIds: dataSourceIds || session.dataContexts.map((dc) => dc.dataSourceId),
            memories: memories.map((m) => ({
              id: m.id,
              content: m.content,
              source: m.source as 'auto' | 'user_confirmed' | 'manual',
              heat: m.heat,
              status: m.status as 'active' | 'disabled',
              createdAt: m.createdAt,
              updatedAt: m.updatedAt,
            })),
          });

          for await (const chunk of agentStream) {
            if (chunk.type === 'text' && chunk.content) {
              fullContent += chunk.content;
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));

            if (chunk.type === 'done') {
              break;
            }
          }

          // Save complete assistant message
          await prisma.message.create({
            data: {
              sessionId,
              role: 'assistant',
              content: fullContent,
            },
          });

          // Update session timestamp
          await prisma.session.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
          });

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Stream failed' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Stream setup error:', error);
    return errors.internalError('Failed to setup stream');
  }
}
