import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST /api/users/[id]/activate
 * Activate or deactivate a user account
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = id;

    console.log('Activating/Deactivating user:', userId);

    // Get the optional body (if backend expects specific data)
    let body = {};
    try {
      const requestBody = await request.json();
      body = requestBody;
    } catch (e) {
      // No body provided, use empty object
    }

    console.log('Request body:', body);

    // Call backend API
    const response = await axios.post(
      `${API_URL}/api/v1/users/${userId}/activate`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('User activation status changed:', userId, response.data);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Activate user error:', error);

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

      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        );
      }

      if (error.response?.status === 422) {
        console.error('Validation error (422):', error.response?.data);
        return NextResponse.json(
          {
            error: error.response?.data?.detail || 'Données de validation invalides',
            details: error.response?.data,
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors du changement de statut',
          details: error.response?.data,
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
