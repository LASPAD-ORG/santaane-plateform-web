import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST /api/manuscripts/submit
 * Submit a new manuscript
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();

    console.log('Submitting manuscript with pdfFilename:', body.pdfFilename);

    const response = await axios.post(
      `${API_URL}/api/v1/manuscripts/submit`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Manuscript submitted successfully:', response.data.id);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Submit manuscript error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la soumission du manuscrit',
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
