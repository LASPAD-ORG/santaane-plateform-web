import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Non authentifié' }, { status: 401 });
    }

    // On récupère le FormData envoyé par le Front (EditorialManagerDialog)
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ detail: 'Aucun fichier fourni' }, { status: 400 });
    }

    // On prépare le transfert vers le Backend Python/Node
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await axios.post(
      `${API_URL}/api/v1/manuscripts/detail/${id}/editorial-upload`,
      backendFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Axios gère automatiquement le Content-Type avec le boundary pour FormData
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Upload Error Proxy:', error.response?.data || error.message);
    return NextResponse.json(
      { detail: error.response?.data?.detail || "Erreur lors de l'envoi au serveur backend" },
      { status: error.response?.status || 500 }
    );
  }
}