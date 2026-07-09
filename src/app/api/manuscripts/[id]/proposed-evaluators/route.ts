import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/manuscripts/[id]/proposed-evaluators
// Liste les évaluateurs externes proposés (éditeur ou évaluateur interne).
export async function GET(
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

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/${id}/proposed-evaluators`,
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
        backendError || { message: 'Erreur lors du chargement des propositions' };

      return NextResponse.json(errorResponse, {
        status: error.response?.status || 500,
      });
    }
    return NextResponse.json(
      { message: 'Erreur lors du chargement des propositions' },
      { status: 500 }
    );
  }
}

// POST /api/manuscripts/[id]/proposed-evaluators
// L'évaluateur interne propose un évaluateur externe (firstName, lastName, email).
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
      `${API_URL}/api/v1/manuscripts/${id}/proposed-evaluators`,
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
      const backendError = error.response?.data;
      const errorResponse =
        backendError || { message: 'Erreur lors de la proposition' };

      return NextResponse.json(errorResponse, {
        status: error.response?.status || 500,
      });
    }
    return NextResponse.json(
      { message: 'Erreur lors de la proposition' },
      { status: 500 }
    );
  }
}