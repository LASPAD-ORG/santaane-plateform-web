import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * PUT /api/users/[id]/password
 * Change user password (admin action)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = id;
  try {
    const token = request.cookies.get('auth_token')?.value;
    const body = await request.json();
    const { password } = body;

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    console.log('Changing password for user:', userId);

    // Call backend API
    const response = await axios.put(
      `${API_URL}/api/v1/users/${userId}/password`,
      { password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Password changed successfully for user:', userId);

    return NextResponse.json(
      { success: true, message: 'Mot de passe modifié avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);

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

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors du changement de mot de passe'
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
