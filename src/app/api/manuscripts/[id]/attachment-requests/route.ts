import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/manuscripts/{id}/attachment-requests
 * Liste les demandes de pieces jointes.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Non authentifie' }, { status: 401 });
    }

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/${id}/attachment-requests`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching attachment requests:', error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { detail: 'Erreur serveur' },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * POST /api/manuscripts/{id}/attachment-requests
 * Cree une demande de piece jointe (editeur).
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Non authentifie' }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.post(
      `${API_URL}/api/v1/manuscripts/${id}/attachment-requests`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating attachment request:', error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { detail: 'Erreur serveur' },
      { status: error.response?.status || 500 }
    );
  }
}