import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/manuscripts/{id}/mark-anonymized
 * Mark manuscript as anonymized (EDITOR only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.post(
      `${BACKEND_URL}/api/v1/manuscripts/${id}/mark-anonymized`,
      body,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error marking as anonymized:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Erreur serveur' };
    return NextResponse.json(message, { status });
  }
}

/**
 * DELETE /api/manuscripts/{id}/mark-anonymized
 * Unmark manuscript as anonymized (EDITOR only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/manuscripts/${id}/mark-anonymized`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error unmarking as anonymized:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Erreur serveur' };
    return NextResponse.json(message, { status });
  }
}
