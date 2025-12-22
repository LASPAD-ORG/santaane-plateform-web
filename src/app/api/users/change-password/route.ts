import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * PUT /api/users/change-password
 * Change authenticated user's own password
 */
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel et le nouveau mot de passe sont requis' },
        { status: 400 }
      );
    }

    console.log('Changing password for user');

    const response = await axios.put(
      `${API_URL}/api/v1/users/me/password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Password changed successfully');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.errorCode || error.response?.data?.detail;
      
      console.log('Sending error response:', { error: errorMessage, status: error.response?.status });
      
      return NextResponse.json(
        { error: errorMessage || 'Erreur lors du changement de mot de passe' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

