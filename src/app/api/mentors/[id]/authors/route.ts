import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/mentors/[id]/authors
 * Fetch authors assigned to a specific mentor from backend API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const mentorId = resolvedParams.id;
    
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const active_only = searchParams.get('active_only') !== 'false'; // Default to true

    console.log('Fetching authors for mentor:', { mentorId, skip, limit, active_only });

    // Call backend API
    const response = await axios.get(`${API_URL}/api/v1/mentors/${mentorId}/authors`, {
      params: {
        skip,
        limit,
        active_only,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Mentor authors fetched successfully:', {
      mentorId,
      total: response.data.total,
      itemsCount: response.data.items?.length,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Get mentor authors error:', error);

    if (axios.isAxiosError(error)) {
      console.error('Mentor authors API error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      if (error.response?.status === 401) {
        const response = NextResponse.json(
          { error: 'Token invalide ou expiré' },
          { status: 401 }
        );
        response.cookies.delete('auth_token');
        return response;
      }

      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Mentor non trouvé' },
          { status: 404 }
        );
      }

      if (error.response?.status === 422) {
        return NextResponse.json(
          {
            error: 'Données invalides',
            details: error.response?.data?.detail
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la récupération des auteurs du mentor'
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
