import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log('[Evaluator Manuscripts] Token exists:', !!token);

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    console.log('[Evaluator Manuscripts] Calling backend:', `${API_URL}/api/v1/manuscripts/my-assignments`);

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/my-assignments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('[Evaluator Manuscripts] Success, got', response.data?.length || 0, 'manuscripts');

    // Le backend retourne directement un tableau
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('[Evaluator Manuscripts] Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Accès interdit - rôle évaluateur requis', details: error.response?.data },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des manuscrits assignés' },
      { status: error.response?.status || 500 }
    );
  }
}
