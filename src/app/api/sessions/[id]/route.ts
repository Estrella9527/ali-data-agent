import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errors } from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/sessions/[id] - Get session details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
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

    return successResponse(session);
  } catch (error) {
    console.error('Failed to get session:', error);
    return errors.internalError();
  }
}

// PATCH /api/sessions/[id] - Update session
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title } = body;

    const session = await prisma.session.update({
      where: { id },
      data: { title },
    });

    return successResponse(session);
  } catch (error) {
    console.error('Failed to update session:', error);
    return errors.internalError();
  }
}

// DELETE /api/sessions/[id] - Delete session
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.session.delete({
      where: { id },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('Failed to delete session:', error);
    return errors.internalError();
  }
}
