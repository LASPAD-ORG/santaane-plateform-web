import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * PUT /api/users/[id]/reset-password
 * Reset user password (Admin only)
 */
export async function PUT(
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

    // Await params in Next.js 15+
    const { id } = await params;

    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    console.log('Resetting password for user:', id);

    // Call backend API
    const response = await axios.put(
      `${API_URL}/api/v1/users/${id}/reset-password`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Password reset successfully for user:', id);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('PUT /api/users/[id]/reset-password error:', error);

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
          { error: 'Permissions insuffisantes. Seul un SUPER_ADMIN peut réinitialiser les mots de passe.' },
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
          error: error.response?.data?.detail || 'Erreur lors de la réinitialisation du mot de passe'
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
