import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// POST /api/manuscripts/[id]/assign-evaluator - Assign evaluator to manuscript
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const response = await axios.post(
      `${API_URL}/api/v1/manuscripts/${id}/assign-evaluator`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.detail || 'Erreur lors de l\'assignation de l\'évaluateur' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Erreur lors de l\'assignation de l\'évaluateur' },
      { status: 500 }
    );
  }
}
