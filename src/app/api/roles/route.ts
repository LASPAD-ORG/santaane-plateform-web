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

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Call backend API with pagination
    const response = await axios.get(`${API_URL}/api/v1/roles/`, {
      params: { skip, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Roles fetched successfully. Data type:', typeof response.data);
    console.log('Full response data:', JSON.stringify(response.data, null, 2));

    // Return paginated response as-is
    return NextResponse.json(response.data, { status: 200 });
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
