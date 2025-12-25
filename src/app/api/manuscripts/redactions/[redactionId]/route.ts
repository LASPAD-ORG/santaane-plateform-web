import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * PUT /api/manuscripts/redactions/{redactionId}
 * Update a redaction (EDITOR only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ redactionId: string }> }
) {
  try {
    const { redactionId } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.put(
      `${BACKEND_URL}/api/v1/manuscripts/redactions/${redactionId}`,
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
    console.error('Error updating redaction:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Erreur serveur' };
    return NextResponse.json(message, { status });
  }
}

/**
 * DELETE /api/manuscripts/redactions/{redactionId}
 * Delete a redaction (EDITOR only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ redactionId: string }> }
) {
  try {
    const { redactionId } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/manuscripts/redactions/${redactionId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error deleting redaction:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Erreur serveur' };
    return NextResponse.json(message, { status });
  }
}
