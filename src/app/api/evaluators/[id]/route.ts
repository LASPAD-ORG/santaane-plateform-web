import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// DELETE /api/evaluators/[id] - soft delete (desactive)
export async function DELETE(
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
    const response = await axios.delete(`${API_URL}/api/v1/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.detail || 'Erreur lors de la suppression' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 500 });
  }
}