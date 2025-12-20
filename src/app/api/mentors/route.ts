import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/mentors
 * Fetch users with mentor role from backend API
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from HTTP-Only cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const available = searchParams.get('available');
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    console.log('Fetching mentors with params:', { available, skip, limit });

    // Call backend users API to get all users, then filter for mentors
    const response = await axios.get(`${API_URL}/api/v1/users`, {
      params: {
        skip,
        limit,
        is_active: available === 'true' ? true : undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Users fetched successfully:', {
      total: response.data.total,
      itemsCount: response.data.items?.length,
    });

    // Filter users to get only those with mentor role
    const mentors = response.data.items?.filter((user: any) => {
      // Check if user has mentor role - adjust based on your actual role structure
      return user.roles && (
        (Array.isArray(user.roles) && user.roles.some((role: any) => 
          typeof role === 'string' ? role.toLowerCase() === 'mentor' : role.name?.toLowerCase() === 'mentor'
        )) ||
        (typeof user.roles === 'string' && user.roles.toLowerCase().includes('mentor'))
      );
    }).map((user: any) => ({
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      roles: user.roles || [],
      isActive: user.is_active,
      laboratoire: user.laboratoire,
      specialite: user.specialite,
    })) || [];

    return NextResponse.json({
      data: mentors,
      total: mentors.length, // Use filtered count instead of total users
      skip: response.data.skip,
      limit: response.data.limit,
      has_more: false, // Since we're filtering client-side, we don't know if there are more
    }, { status: 200 });
  } catch (error) {
    console.error('Get mentors error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const response = NextResponse.json(
          { error: 'Token invalide ou expiré' },
          { status: 401 }
        );
        response.cookies.delete('auth_token');
        return response;
      }

      if (error.response?.status === 403) {
        return NextResponse.json(
          { error: 'Permissions insuffisantes' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la récupération des mentors'
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
