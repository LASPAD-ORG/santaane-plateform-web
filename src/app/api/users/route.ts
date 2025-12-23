import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/users
 * Fetch users from backend API with pagination
 * 
 * Query parameters:
 * - skip: number (default: 0)
 * - limit: number (default: 20)
 * 
 * Returns paginated user list with JWT authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from HTTP-Only cookie
    const token = request.cookies.get('auth_token')?.value;

    console.log('/api/users called, token exists:', !!token);

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get pagination and filter parameters from URL
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const email = searchParams.get('email') || undefined;
    const fullName = searchParams.get('fullName') || undefined;
    const role = searchParams.get('role') || undefined;
    const isActiveParam = searchParams.get('isActive');
    const isActive = isActiveParam ? isActiveParam === 'true' : undefined;

    console.log('Fetching users with pagination and filters:', { skip, limit, email, fullName, role, isActive });

    // Build params object
    const params: any = {
      skip,
      limit,
    };

    // Add optional filters if specified
    if (email) params.email = email;
    if (fullName) params.fullName = fullName;
    if (role) params.role = role;
    if (isActive !== undefined) params.isActive = isActive;

    // Call backend API with token
    const response = await axios.get(`${API_URL}/api/v1/users`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Users fetched successfully:', {
      total: response.data.total,
      itemsCount: response.data.items?.length,
    });

    // Return paginated user data
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Get users error:', error);

    if (axios.isAxiosError(error)) {
      // If token is invalid, return 401
      if (error.response?.status === 401) {
        const response = NextResponse.json(
          { error: 'Token invalide ou expiré' },
          { status: 401 }
        );

        // Clear the invalid token
        response.cookies.delete('auth_token');

        return response;
      }

      // If forbidden (insufficient permissions)
      if (error.response?.status === 403) {
        return NextResponse.json(
          { error: 'Permissions insuffisantes' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la récupération des utilisateurs'
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
 * POST /api/users
 * Create a new user
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
    console.log('Creating user via proxy:', body);

    // Call backend API
    const response = await axios.post(
      `${API_URL}/api/v1/users`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('User created successfully via proxy:', response.data.id);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Create user proxy error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const response = NextResponse.json(
          { error: 'Token invalide ou expiré' },
          { status: 401 }
        );
        response.cookies.delete('auth_token');
        return response;
      }

      if (error.response?.status === 403) {
        return NextResponse.json(
          { error: 'Permissions insuffisantes' },
          { status: 403 }
        );
      }

      if (error.response?.status === 422) {
        return NextResponse.json(
          {
            error: 'Données invalides',
            details: error.response?.data?.detail
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la création de l\'utilisateur'
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
