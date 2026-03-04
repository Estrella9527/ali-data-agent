import { NextRequest } from 'next/server';
import { unlink } from 'fs/promises';
import prisma from '@/lib/prisma';
import { successResponse, errors } from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/files/[id] - Get file details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!file) {
      return errors.notFound('File');
    }

    return successResponse(file);
  } catch (error) {
    console.error('Failed to get file:', error);
    return errors.internalError();
  }
}

// DELETE /api/files/[id] - Delete file
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!file) {
      return errors.notFound('File');
    }

    // Delete physical file
    try {
      await unlink(file.path);
    } catch (e) {
      console.warn('Failed to delete physical file:', e);
    }

    // Delete database record
    await prisma.uploadedFile.delete({
      where: { id },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('Failed to delete file:', error);
    return errors.internalError();
  }
}
