import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errors } from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/memories/[id] - Get memory details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const memory = await prisma.memory.findUnique({
      where: { id },
    });

    if (!memory) {
      return errors.notFound('Memory');
    }

    return successResponse(memory);
  } catch (error) {
    console.error('Failed to get memory:', error);
    return errors.internalError();
  }
}

// PATCH /api/memories/[id] - Update memory
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, status } = body;

    const memory = await prisma.memory.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(status && { status }),
      },
    });

    return successResponse(memory);
  } catch (error) {
    console.error('Failed to update memory:', error);
    return errors.internalError();
  }
}

// DELETE /api/memories/[id] - Delete memory
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.memory.delete({
      where: { id },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('Failed to delete memory:', error);
    return errors.internalError();
  }
}
