import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { detail: 'Non authentifié' },
        { status: 401 }
      );
    }

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/detail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data,
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { detail: 'Erreur lors de la récupération du manuscrit' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { detail: 'Non authentifié' },
        { status: 401 }
      );
    }

    const response = await axios.put(
      `${API_URL}/api/v1/manuscripts/detail/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data,
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { detail: 'Erreur lors de la mise à jour du manuscrit' },
      { status: 500 }
    );
  }
}
