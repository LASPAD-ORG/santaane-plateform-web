import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Lire le cookie directement depuis les headers de la requête
    const cookieHeader = request.headers.get('cookie') || '';
    console.log('[redaction-masks] Cookie header:', cookieHeader.substring(0, 100));
    
    const match = cookieHeader.match(/auth_token=([^;]+)/);
    const authToken = match?.[1];
    
    console.log('[redaction-masks] Token found:', !!authToken);

    if (!authToken) {
      return NextResponse.json({ detail: 'Token manquant' }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/api/v1/manuscripts/${id}/redaction-masks`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[redaction-masks] Error:', error);
    return NextResponse.json({ detail: 'Erreur serveur' }, { status: 500 });
  }
}