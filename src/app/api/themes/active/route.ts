import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// GET /api/themes/active - appels actifs
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    const skip = request.nextUrl.searchParams.get('skip') || '0';
    const limit = request.nextUrl.searchParams.get('limit') || '100';

    const response = await axios.get(`${API_URL}/api/v1/themes/active`, {
      params: { skip, limit },
      headers: { Authorization: `Bearer ${token}` },
    });

    let themes = response.data;
    if (!Array.isArray(themes)) {
      themes = response.data.results || response.data.items || [];
    }
    return NextResponse.json(themes, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.detail || 'Erreur lors de la récupération des appels' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}