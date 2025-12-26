import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/author/manuscripts/recent
 * Get recent manuscripts for the authenticated author
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get recent manuscripts (last 5)
    const response = await axios.get(`${API_URL}/api/v1/manuscripts/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 5,
        ordering: '-created_at'  // Order by most recent
      }
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('GET /api/author/manuscripts/recent error:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.detail || 'Erreur lors de la récupération des manuscrits';
      
      return NextResponse.json(
        { error: message },
        { status }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}