import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/manuscripts/{id}/attachments/{attachmentId}/download
 * Telecharge une piece jointe (binaire).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; attachmentId: string }> }
) {
  try {
    const { id, attachmentId } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/${id}/attachments/${attachmentId}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer',
      }
    );

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const contentDisposition = response.headers['content-disposition'] || 'attachment';

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error: any) {
    console.error('Error downloading attachment:', error.response?.status || error.message);
    return NextResponse.json({ detail: 'Fichier introuvable' }, { status: error.response?.status || 404 });
  }
}