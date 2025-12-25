import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const manuscriptId = resolvedParams.id;

    // Get auth token from cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call backend API to get redaction masks
    const response = await fetch(
      `${API_BASE_URL}/api/v1/manuscripts/${manuscriptId}/redaction-masks`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend redaction masks error:', response.status, errorData);
      
      if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (response.status === 403) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (response.status === 404) {
        return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
      }

      return NextResponse.json(
        { error: 'Failed to fetch redaction masks' },
        { status: response.status }
      );
    }

    const redactionMasks = await response.json();
    return NextResponse.json(redactionMasks);
    
  } catch (error) {
    console.error('API route error (redaction-masks):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}