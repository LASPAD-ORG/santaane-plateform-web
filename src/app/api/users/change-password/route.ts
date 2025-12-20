import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST /api/users/change-password
 * Change user password (for first login or password reset)
 * 
 * Body: { 
 *   currentPassword: string, 
 *   newPassword: string 
 * }
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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel et le nouveau mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    console.log('Changing password for user');

    // Appel à l'API backend pour changer le mot de passe
    const response = await axios.post(
      `${API_URL}/api/v1/users/change-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Password changed successfully');
    return NextResponse.json(
      { message: 'Mot de passe changé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: 'Mot de passe actuel incorrect' },
          { status: 401 }
        );
      }

      if (error.response?.status === 403) {
        return NextResponse.json(
          { error: 'Permissions insuffisantes' },
          { status: 403 }
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
