import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { agentClient } from '@/lib/agent-client';
import { successResponse, errors } from '@/lib/api-response';

// POST /api/chat - Send a message and get response
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
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Last 20 messages for context
        },
        dataContexts: {
          include: {
            dataSource: true,
          },
        },
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

    // Call Agent Service
    const agentResponse = await agentClient.chat({
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

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        sessionId,
        role: 'assistant',
        content: agentResponse.message,
        metadata: JSON.parse(JSON.stringify({
          toolCalls: agentResponse.toolCalls || null,
          sqlQueries: agentResponse.sqlQueries || null,
          ...(agentResponse.metadata || {}),
        })),
      },
    });

    // Update session timestamp
    await prisma.session.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return successResponse({
      message: assistantMessage,
      metadata: agentResponse.metadata,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return errors.internalError('Failed to process message');
  }
}
