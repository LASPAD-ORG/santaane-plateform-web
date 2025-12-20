import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/roles
 * Get all available roles
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

    console.log('Fetching available roles from backend:', `${API_URL}/api/v1/roles/`);

    // Call backend API - Backend usually expects trailing slash for DRF
    const response = await axios.get(`${API_URL}/api/v1/roles/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Roles fetched successfully. Data type:', typeof response.data);
    console.log('Full response data:', JSON.stringify(response.data, null, 2));

    // Ensure we return an array to the client
    let roles = response.data;
    if (!Array.isArray(roles)) {
      roles = response.data.results || response.data.items || [];
    }

    console.log('Returning roles array of length:', roles.length);

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error('GET /api/roles error:', error);
    // ... (rest of the error handling remains the same)
  }
}

/**
 * POST /api/roles
 * Create a new role
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
    console.log('Creating new role with data:', body);

    // Call backend API
    const response = await axios.post(`${API_URL}/api/v1/roles/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Role created successfully:', response.data.id);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/roles error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la création du rôle'
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
