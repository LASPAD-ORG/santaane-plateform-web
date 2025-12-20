import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * DELETE /api/roles/remove/[userId]/[roleId]
 * Remove a role from a user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; roleId: string }> }
) {
  const { userId, roleId } = await params;
  try {
    const token = request.cookies.get('auth_token')?.value;

    console.log('Removing role from user:', { userId, roleId });

    // Call backend API
    await axios.delete(
      `${API_URL}/api/v1/roles/remove/${userId}/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Role removed successfully:', { userId, roleId });

    return NextResponse.json(
      { success: true, message: 'Rôle retiré avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove role error:', error);

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

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la suppression du rôle'
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
