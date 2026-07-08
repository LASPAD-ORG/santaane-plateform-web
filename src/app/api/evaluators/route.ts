import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/evaluators - List all evaluators
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const size = searchParams.get('size') || '20';
    const type = searchParams.get('type');
    const typeParam = type ? `&type=${type}` : '';

    const response = await axios.get(
      `${API_URL}/api/v1/users/evaluators?page=${page}&size=${size}${typeParam}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.detail || 'Erreur lors de la récupération des évaluateurs' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des évaluateurs' },
      { status: 500 }
    );
  }
}

// POST /api/evaluators - Create new evaluator
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.post(
      `${API_URL}/api/v1/users/evaluators`,
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
        { message: error.response?.data?.detail || 'Erreur lors de la création de l\'évaluateur' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'évaluateur' },
      { status: 500 }
    );
  }
}
