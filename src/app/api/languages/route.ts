import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/languages
 * Get all available languages
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

    console.log('Fetching available languages from backend:', `${API_URL}/api/v1/languages/`);

    // Call backend API - Backend usually expects trailing slash for DRF
    const response = await axios.get(`${API_URL}/api/v1/languages/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Languages fetched successfully. Data type:', typeof response.data);
    console.log('Full response data:', JSON.stringify(response.data, null, 2));

    // Ensure we return an array to the client
    let languages = response.data;
    if (!Array.isArray(languages)) {
      languages = response.data.results || response.data.items || [];
    }

    console.log('Returning languages array of length:', languages.length);

    return NextResponse.json(languages, { status: 200 });
  } catch (error) {
    console.error('GET /api/languages error:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la récupération des langues'
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
 * POST /api/languages
 * Create a new language
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
    console.log('Creating new language with data:', body);

    // Call backend API
    const response = await axios.post(`${API_URL}/api/v1/languages/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Language created successfully:', response.data.id);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/languages error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la création de la langue'
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
