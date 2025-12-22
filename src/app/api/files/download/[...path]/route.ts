import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/files/download/[...path]
 * Download a file from the server
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { path } = await context.params;
    const filePath = path.join('/');

    console.log('Downloading file:', filePath);

    const response = await axios.get(
      `${API_URL}/api/v1/files/download/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      }
    );

    // Extraire le nom du fichier du path
    const filename = filePath.split('/').pop() || 'download.pdf';

    // Retourner le fichier avec les bons headers
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': response.headers['content-type'] || 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Download file error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors du téléchargement du fichier',
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
