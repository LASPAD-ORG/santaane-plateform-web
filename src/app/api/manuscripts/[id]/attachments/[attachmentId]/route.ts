import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * DELETE /api/manuscripts/{id}/attachments/{attachmentId}
 * Supprime une piece jointe.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; attachmentId: string }> }
) {
  try {
    const { id, attachmentId } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Non authentifie' }, { status: 401 });
    }

    const response = await axios.delete(
      `${API_URL}/api/v1/manuscripts/${id}/attachments/${attachmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error deleting attachment:', error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { detail: 'Erreur serveur' },
      { status: error.response?.status || 500 }
    );
  }
}