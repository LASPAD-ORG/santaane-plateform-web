import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Get token from HTTP-Only cookie
    const token = request.cookies.get('auth_token')?.value;

    console.log('/api/auth/me called, token exists:', !!token);

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Call backend API with token
    const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return user data (NEVER store this in cookies client-side)
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Get current user error:', error);

    if (axios.isAxiosError(error)) {
      // If token is invalid, clear the cookie
      if (error.response?.status === 401) {
        const response = NextResponse.json(
          { error: 'Token invalide' },
          { status: 401 }
        );

        // Clear the invalid token
        response.cookies.delete('auth_token');

        return response;
      }

      return NextResponse.json(
        { error: error.response?.data?.detail || 'Erreur lors de la récupération des données' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
