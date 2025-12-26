import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const manuscriptId = resolvedParams.id;

    // Appeler l'API backend pour récupérer le statut d'évaluation
    const response = await fetch(
      `${API_URL}/api/v1/manuscripts/${manuscriptId}/evaluation-status`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Manuscrit non trouvé' },
          { status: 404 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const evaluationStatus = await response.json();
    
    return NextResponse.json(evaluationStatus);
    
  } catch (error) {
    console.error('Erreur lors de la récupération du statut d\'évaluation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}