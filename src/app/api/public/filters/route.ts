import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const backendUrl = `${API_URL}/api/v1/public/filters`;
    
    const response = await axios.get(backendUrl);
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error fetching filters:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data?.detail || 'Failed to fetch filters' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
