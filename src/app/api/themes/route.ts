import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/themes
 * Get all available themes
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

    console.log('Fetching available themes from backend:', `${API_URL}/api/v1/themes/active`);

    // Call backend API - Get only active themes for manuscript submission
    const response = await axios.get(`${API_URL}/api/v1/themes/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Themes fetched successfully. Data type:', typeof response.data);
    console.log('Full response data:', JSON.stringify(response.data, null, 2));

    // Ensure we return an array to the client
    let themes = response.data;
    if (!Array.isArray(themes)) {
      themes = response.data.results || response.data.items || [];
    }

    console.log('Returning themes array of length:', themes.length);

    return NextResponse.json(themes, { status: 200 });
  } catch (error) {
    console.error('GET /api/themes error:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la récupération des appels'
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/themes
 * Create a new theme
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Creating new theme with data:', body);

    // Call backend API
    const response = await axios.post(`${API_URL}/api/v1/themes/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Theme created successfully:', response.data.id);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/themes error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la création de l\'appel'
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
