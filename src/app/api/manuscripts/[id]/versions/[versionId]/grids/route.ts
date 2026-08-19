import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** GET /api/manuscripts/{id}/versions/{versionId}/grids - grilles archivees */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await context.params;
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ detail: 'Non authentifie' }, { status: 401 });
    }
    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/${id}/versions/${versionId}/grids`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching version grids:', error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { detail: 'Erreur serveur' },
      { status: error.response?.status || 500 }
    );
  }
}