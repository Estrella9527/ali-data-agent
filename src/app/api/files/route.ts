import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/prisma';
import { successResponse, errors, paginatedResponse } from '@/lib/api-response';
import { parseSearchParams, generateId } from '@/lib/utils';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/tmp/uploads';

// GET /api/files - List all uploaded files
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, query } = parseSearchParams(request.nextUrl.searchParams);

    const where = query
      ? {
          OR: [
            { filename: { contains: query, mode: 'insensitive' as const } },
            { originalName: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [files, total] = await Promise.all([
      prisma.uploadedFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.uploadedFile.count({ where }),
    ]);

    return paginatedResponse(files, total, page, pageSize);
  } catch (error) {
    console.error('Failed to list files:', error);
    return errors.internalError();
  }
}

// POST /api/files - Upload a new file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errors.badRequest('No file provided');
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];

    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      return errors.badRequest('Only CSV and Excel files are allowed');
    }

    // Validate file size (200MB max)
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      return errors.badRequest('File size exceeds 200MB limit');
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const uniqueId = generateId();
    const filename = `${uniqueId}${ext}`;
    const filePath = join(UPLOAD_DIR, filename);

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Create database record
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        path: filePath,
        status: 'processing',
      },
    });

    // TODO: Trigger async file processing (parse columns, preview data)

    return successResponse(uploadedFile, 201);
  } catch (error) {
    console.error('Failed to upload file:', error);
    return errors.internalError();
  }
}
