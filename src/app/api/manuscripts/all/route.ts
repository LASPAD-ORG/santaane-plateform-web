import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { detail: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('theme_id');
    const sectionId = searchParams.get('section_id');
    const languageId = searchParams.get('language_id');
    const skip = searchParams.get('skip') || '0';
    const limit = searchParams.get('limit') || '100';

    const params = new URLSearchParams({
      skip,
      limit,
    });

    if (themeId) params.append('theme_id', themeId);
    if (sectionId) params.append('section_id', sectionId);
    if (languageId) params.append('language_id', languageId);

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/all?${params.toString()}`,
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
      { detail: 'Erreur lors de la récupération des manuscrits' },
      { status: 500 }
    );
  }
}
