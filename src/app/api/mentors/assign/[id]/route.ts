import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/mentors/assign/[id]
 * Fetch a specific mentor assignment by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const assignmentId = resolvedParams.id;
    
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const response = await axios.get(`${API_URL}/api/v1/mentors/assign/${assignmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Get assignment error:', error);

    if (axios.isAxiosError(error)) {
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
          { error: 'Assignation non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la récupération de l\'assignation'
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

/**
 * PUT /api/mentors/assign/[id]
 * Update a mentor assignment
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const assignmentId = resolvedParams.id;
    
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Updating assignment via proxy:', { id: assignmentId, ...body });

    const response = await axios.put(
      `${API_URL}/api/v1/mentors/assign/${assignmentId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Assignment updated successfully via proxy:', response.data.id);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Update assignment proxy error:', error);

    if (axios.isAxiosError(error)) {
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
          { error: 'Assignation non trouvée' },
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
          error: error.response?.data?.detail || 'Erreur lors de la mise à jour de l\'assignation'
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

/**
 * DELETE /api/mentors/assign/[id]
 * Delete a mentor assignment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const assignmentId = resolvedParams.id;
    
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    await axios.delete(`${API_URL}/api/v1/mentors/assign/${assignmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Assignment deleted successfully via proxy:', assignmentId);

    return NextResponse.json({ message: 'Assignation supprimée avec succès' }, { status: 200 });
  } catch (error) {
    console.error('Delete assignment proxy error:', error);

    if (axios.isAxiosError(error)) {
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
          { error: 'Assignation non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la suppression de l\'assignation'
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
