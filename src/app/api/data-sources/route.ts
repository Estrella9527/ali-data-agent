import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errors, paginatedResponse } from '@/lib/api-response';
import { parseSearchParams } from '@/lib/utils';

// GET /api/data-sources - List all data sources
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, query } = parseSearchParams(request.nextUrl.searchParams);

    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [dataSources, total] = await Promise.all([
      prisma.dataSource.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { tables: true },
          },
        },
      }),
      prisma.dataSource.count({ where }),
    ]);

    // Remove sensitive config data from response
    const sanitizedSources = dataSources.map((ds) => ({
      ...ds,
      config: {
        ...((ds.config as Record<string, unknown>) || {}),
        password: undefined,
      },
    }));

    return paginatedResponse(sanitizedSources, total, page, pageSize);
  } catch (error) {
    console.error('Failed to list data sources:', error);
    return errors.internalError();
  }
}

// POST /api/data-sources - Create a new data source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, config, description } = body;

    if (!name || !type) {
      return errors.badRequest('name and type are required');
    }

    const dataSource = await prisma.dataSource.create({
      data: {
        name,
        type,
        config: config || {},
        description,
      },
    });

    return successResponse(dataSource, 201);
  } catch (error) {
    console.error('Failed to create data source:', error);
    return errors.internalError();
  }
}
