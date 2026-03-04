import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errors } from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/agents/[id] - Get agent details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const agent = await prisma.customAgent.findUnique({
      where: { id },
    });

    if (!agent) {
      return errors.notFound('Agent');
    }

    return successResponse(agent);
  } catch (error) {
    console.error('Failed to get agent:', error);
    return errors.internalError();
  }
}

// PATCH /api/agents/[id] - Update agent
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, instruction, knowledge, config, isPublished } = body;

    const agent = await prisma.customAgent.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(instruction !== undefined && { instruction }),
        ...(knowledge !== undefined && { knowledge }),
        ...(config && { config }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return successResponse(agent);
  } catch (error) {
    console.error('Failed to update agent:', error);
    return errors.internalError();
  }
}

// DELETE /api/agents/[id] - Delete agent
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.customAgent.delete({
      where: { id },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('Failed to delete agent:', error);
    return errors.internalError();
  }
}
