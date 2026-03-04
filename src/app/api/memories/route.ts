import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errors, paginatedResponse } from '@/lib/api-response';
import { parseSearchParams } from '@/lib/utils';

// GET /api/memories - List all memories
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, query, sortBy, sortOrder } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const status = request.nextUrl.searchParams.get('status');

    const where = {
      ...(query && {
        content: { contains: query, mode: 'insensitive' as const },
      }),
      ...(status && { status }),
    };

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.memory.count({ where }),
    ]);

    return paginatedResponse(memories, total, page, pageSize);
  } catch (error) {
    console.error('Failed to list memories:', error);
    return errors.internalError();
  }
}

// POST /api/memories - Create a new memory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, source = 'manual' } = body;

    if (!content) {
      return errors.badRequest('content is required');
    }

    const memory = await prisma.memory.create({
      data: {
        content,
        source,
      },
    });

    return successResponse(memory, 201);
  } catch (error) {
    console.error('Failed to create memory:', error);
    return errors.internalError();
  }
}
