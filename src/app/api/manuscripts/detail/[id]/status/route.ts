import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const token = request.cookies.get('auth_token')?.value;

    // Log détaillé du payload reçu
    console.log('📥 API Route - Payload reçu:', {
      id,
      body,
      email_comment: body.email_comment,
      new_status: body.new_status,
      manuscript_id: body.manuscript_id
    });

    if (!token) {
      console.log('❌ Token manquant');
      return NextResponse.json(
        { detail: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Transform payload to match expected backend format
    const transformedBody = {
      manuscript_id: body.manuscript_id || parseInt(id),
      new_status: body.new_status || body.status,
      email_comment: body.email_comment,
    };

    console.log('🔄 API Route - Payload transformé:', transformedBody);

    const response = await axios.put(
      `${API_URL}/api/v1/manuscripts/detail/${id}/status`,
      transformedBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ API Route - Succès backend:', response.data);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('❌ API Route - Erreur:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ API Route - Erreur backend:', {
        status: error.response.status,
        data: error.response.data
      });
      return NextResponse.json(
        error.response.data,
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { detail: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
}
