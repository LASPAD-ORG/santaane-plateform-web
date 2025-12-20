import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { MentorAssignment, addAssignment, findActiveAssignmentByAuthor, getAllAssignments } from '@/lib/assignments-store';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
/**
 * GET /api/mentors/assign
 * Fetch all mentor assignments from backend API
 */
export async function GET(request: NextRequest) {
  try {
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
    console.log('Fetching all assignments:', { skip, limit });
    // Call backend API
    const response = await axios.get(`${API_URL}/api/v1/mentors/assign`, {
      params: {
        skip,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Assignments fetched successfully:', {
      total: response.data.total,
      itemsCount: response.data.items?.length,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Get assignments error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const response = NextResponse.json(
          { error: 'Token invalide ou expiré' },
          { status: 401 }
        );
        response.cookies.delete('auth_token');
        return response;
      }
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de la récupération des assignations'
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
 * POST /api/mentors/assign
 * Create a mentor-author assignment
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }
    const body = await request.json();
    console.log('Creating mentor assignment:', body);
    // Validate required fields
    if (!body.author_id || !body.mentor_id) {
      return NextResponse.json(
        { error: 'author_id et mentor_id sont requis' },
        { status: 400 }
      );
    }
    // Call backend API
    const response = await axios.post(`${API_URL}/api/v1/mentors/assign`, {
      author_id: body.author_id,
      mentor_id: body.mentor_id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Assignment created successfully:', response.data.id);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Create assignment error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Assignment API error details:', {
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
          error: error.response?.data?.detail || 'Erreur lors de la création de l\'assignation'
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
    
