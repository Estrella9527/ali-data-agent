import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errors } from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/data-sources/[id] - Get data source details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const dataSource = await prisma.dataSource.findUnique({
      where: { id },
      include: {
        tables: {
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!dataSource) {
      return errors.notFound('Data source');
    }

    // Remove sensitive config data
    const sanitized = {
      ...dataSource,
      config: {
        ...((dataSource.config as Record<string, unknown>) || {}),
        password: undefined,
      },
    };

    return successResponse(sanitized);
  } catch (error) {
    console.error('Failed to get data source:', error);
    return errors.internalError();
  }
}

// PATCH /api/data-sources/[id] - Update data source
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, config, description } = body;

    const dataSource = await prisma.dataSource.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(config && { config }),
        ...(description !== undefined && { description }),
      },
    });

    return successResponse(dataSource);
  } catch (error) {
    console.error('Failed to update data source:', error);
    return errors.internalError();
  }
}

// DELETE /api/data-sources/[id] - Delete data source
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if it's a builtin source
    const dataSource = await prisma.dataSource.findUnique({
      where: { id },
    });

    if (!dataSource) {
      return errors.notFound('Data source');
    }

    if (dataSource.isBuiltin) {
      return errors.badRequest('Cannot delete builtin data source');
    }

    await prisma.dataSource.delete({
      where: { id },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('Failed to delete data source:', error);
    return errors.internalError();
  }
}
