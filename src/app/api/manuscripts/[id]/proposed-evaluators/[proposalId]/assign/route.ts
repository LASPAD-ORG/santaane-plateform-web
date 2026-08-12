import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// POST /api/manuscripts/[id]/proposed-evaluators/[proposalId]/assign
// L'éditeur affecte un évaluateur externe proposé (crée le compte si besoin).
export async function POST(
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
    const body = await request.json();

    const response = await axios.post(
      `${API_URL}/api/v1/manuscripts/${id}/proposed-evaluators/${proposalId}/assign`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data;
      const errorResponse =
        backendError || { message: "Erreur lors de l'affectation" };

      return NextResponse.json(errorResponse, {
        status: error.response?.status || 500,
      });
    }
    return NextResponse.json(
      { message: "Erreur lors de l'affectation" },
      { status: 500 }
    );
  }
}