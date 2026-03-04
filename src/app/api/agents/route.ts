import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errors, paginatedResponse } from '@/lib/api-response';
import { parseSearchParams } from '@/lib/utils';

// GET /api/agents - List all custom agents
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, query } = parseSearchParams(request.nextUrl.searchParams);
    const published = request.nextUrl.searchParams.get('published');

    const where = {
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
        ],
      }),
      ...(published !== null && { isPublished: published === 'true' }),
    };

    const [agents, total] = await Promise.all([
      prisma.customAgent.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.customAgent.count({ where }),
    ]);

    return paginatedResponse(agents, total, page, pageSize);
  } catch (error) {
    console.error('Failed to list agents:', error);
    return errors.internalError();
  }
}

// POST /api/agents - Create a new custom agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, instruction, knowledge, config } = body;

    if (!name) {
      return errors.badRequest('name is required');
    }

    const agent = await prisma.customAgent.create({
      data: {
        name,
        description,
        instruction,
        knowledge,
        config,
      },
    });

    return successResponse(agent, 201);
  } catch (error) {
    console.error('Failed to create agent:', error);
    return errors.internalError();
  }
}
