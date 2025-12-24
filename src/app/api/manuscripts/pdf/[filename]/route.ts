import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Le filename peut contenir "manuscripts/" au début, on le nettoie
    const cleanFilename = filename.replace(/^manuscripts\//, '');

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/pdf/${cleanFilename}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      }
    );

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${cleanFilename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du PDF:', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: error.response.status }
      );
    }

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'PDF non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération du PDF' },
      { status: 500 }
    );
  }
}
