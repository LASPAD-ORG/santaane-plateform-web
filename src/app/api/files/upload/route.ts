import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST /api/files/upload
 * Upload a file to the server
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer le FormData avec le fichier
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subdirectory = formData.get('subdirectory') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    // Préparer le FormData pour l'API backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Construire l'URL avec le paramètre subdirectory si fourni
    let uploadUrl = `${API_URL}/api/v1/files/upload`;
    if (subdirectory) {
      uploadUrl += `?subdirectory=${encodeURIComponent(subdirectory)}`;
    }

    console.log('Uploading file:', file.name, 'to subdirectory:', subdirectory);

    const response = await axios.post(uploadUrl, backendFormData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('File uploaded successfully:', response.data.fileId);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Upload file error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de l\'upload du fichier',
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
