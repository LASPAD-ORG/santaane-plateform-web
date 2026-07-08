import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// DELETE /api/manuscripts/[id]/proposed-evaluators/[proposalId]
// L'évaluateur interne retire une proposition.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; proposalId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const { id, proposalId } = await params;

    const response = await axios.delete(
      `${API_URL}/api/v1/manuscripts/${id}/proposed-evaluators/${proposalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data;
      const errorResponse =
        backendError || { message: 'Erreur lors de la suppression de la proposition' };

      return NextResponse.json(errorResponse, {
        status: error.response?.status || 500,
      });
    }
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la proposition' },
      { status: 500 }
    );
  }
}