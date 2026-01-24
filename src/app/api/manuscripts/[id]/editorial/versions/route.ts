import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Non authentifié' }, { status: 401 });
    }

    // Appel au backend Python/FastAPI (port 8000)
    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/detail/${id}/editorial-versions`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Erreur Proxy Editorial:', error.response?.data || error.message);
    return NextResponse.json(
      { detail: 'Erreur lors de la récupération des versions via le backend' },
      { status: error.response?.status || 500 }
    );
  }
}