import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/manuscripts/{id}/attachments
 * Liste les pieces jointes d'un manuscrit.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Non authentifie' }, { status: 401 });
    }

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/${id}/attachments`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching attachments:', error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { detail: 'Erreur serveur' },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * POST /api/manuscripts/{id}/attachments
 * Depose une piece jointe (multipart).
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Non authentifie' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ detail: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Transferer le FormData tel quel au backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const title = formData.get('title');
    const description = formData.get('description');
    const visibleToAuthor = formData.get('visible_to_author');
    const requestId = formData.get('request_id');

    if (title !== null) backendFormData.append('title', title as string);
    if (description !== null) backendFormData.append('description', description as string);
    if (visibleToAuthor !== null) backendFormData.append('visible_to_author', visibleToAuthor as string);
    if (requestId !== null) backendFormData.append('request_id', requestId as string);

    const response = await axios.post(
      `${API_URL}/api/v1/manuscripts/${id}/attachments`,
      backendFormData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error uploading attachment:', error.response?.data || error.message);
    return NextResponse.json(
      { detail: error.response?.data?.detail || "Erreur lors de l'envoi au serveur backend" },
      { status: error.response?.status || 500 }
    );
  }
}