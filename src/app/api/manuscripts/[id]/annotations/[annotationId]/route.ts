import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * PUT /api/manuscripts/annotations/{annotationId}
 * Update an existing annotation
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ annotationId: string }> }
) {
  try {
    const { annotationId } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.put(
      `${BACKEND_URL}/api/v1/manuscripts/annotations/${annotationId}`,
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
    console.error('Error updating annotation:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Erreur serveur' };
    return NextResponse.json(message, { status });
  }
}

/**
 * DELETE /api/manuscripts/annotations/{annotationId}
 * Delete an annotation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ annotationId: string }> }
) {
  try {
    const { annotationId } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    await axios.delete(
      `${BACKEND_URL}/api/v1/manuscripts/annotations/${annotationId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting annotation:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Erreur serveur' };
    return NextResponse.json(message, { status });
  }
}
