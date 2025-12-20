import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST /api/roles/assign
 * Assign a role to a user
 * 
 * Body: { user_id: string, role_id: number }
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
    const { user_id, role_id } = body;

    if (!user_id || !role_id) {
      return NextResponse.json(
        { error: 'user_id et role_id sont requis' },
        { status: 400 }
      );
    }

    console.log('Assigning role to user:', { user_id, role_id });

    // Call backend API - Try with camelCase and trailing slash which is common in this backend
    const response = await axios.post(
      `${API_URL}/api/v1/roles/assign/`,
      { userId: user_id, roleId: role_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Role assigned successfully:', { user_id, role_id });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Assign role error:', error);

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
          { error: 'Utilisateur ou rôle non trouvé' },
          { status: 404 }
        );
      }

      if (error.response?.status === 409) {
        return NextResponse.json(
          { error: 'L\'utilisateur possède déjà ce rôle' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de l\'assignation du rôle'
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
