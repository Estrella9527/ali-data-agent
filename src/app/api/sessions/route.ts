import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errors, paginatedResponse } from '@/lib/api-response';
import { parseSearchParams } from '@/lib/utils';

// GET /api/sessions - List all sessions
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, query } = parseSearchParams(request.nextUrl.searchParams);

    const where = query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { messages: true },
          },
        },
      }),
      prisma.session.count({ where }),
    ]);

    return paginatedResponse(sessions, total, page, pageSize);
  } catch (error) {
    console.error('Failed to list sessions:', error);
    return errors.internalError();
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, dataSourceIds } = body;

    const session = await prisma.session.create({
      data: {
        title,
        dataContexts: dataSourceIds
          ? {
              create: dataSourceIds.map((id: string) => ({
                dataSourceId: id,
              })),
            }
          : undefined,
      },
      include: {
        dataContexts: {
          include: {
            dataSource: true,
          },
        },
      },
    });

    return successResponse(session, 201);
  } catch (error) {
    console.error('Failed to create session:', error);
    return errors.internalError();
  }
}
