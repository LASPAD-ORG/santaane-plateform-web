import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * PUT /api/manuscripts/[id]/docx
 * Update manuscript DOCX filename after acceptance
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { docxFilename } = body;

    if (!docxFilename) {
      return NextResponse.json(
        { error: 'Le nom du fichier DOCX est requis' },
        { status: 400 }
      );
    }

    console.log('Updating DOCX filename for manuscript ID:', id);

    // Call backend API to update manuscript with docxFilename
    const response = await axios.put(
      `${API_URL}/api/v1/manuscripts/${id}/docx`,
      { docxFilename },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Update DOCX filename error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la mise à jour du fichier DOCX',
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
