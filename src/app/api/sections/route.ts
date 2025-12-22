import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/sections
 * Get all available sections
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

    console.log('Fetching available sections from backend:', `${API_URL}/api/v1/sections/`);

    // Call backend API - Backend usually expects trailing slash for DRF
    const response = await axios.get(`${API_URL}/api/v1/sections/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Sections fetched successfully. Data type:', typeof response.data);
    console.log('Full response data:', JSON.stringify(response.data, null, 2));

    // Ensure we return an array to the client
    let sections = response.data;
    if (!Array.isArray(sections)) {
      sections = response.data.results || response.data.items || [];
    }

    console.log('Returning sections array of length:', sections.length);

    return NextResponse.json(sections, { status: 200 });
  } catch (error) {
    console.error('GET /api/sections error:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la récupération des sections'
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
 * POST /api/sections
 * Create a new section
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
    console.log('Creating new section with data:', body);

    // Call backend API
    const response = await axios.post(`${API_URL}/api/v1/sections/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Section created successfully:', response.data.id);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/sections error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la création de la section'
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
