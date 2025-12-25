import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Transmission au backend Python
    const response = await axios.post(`${API_URL}/api/v1/auth/reset-password-confirm`, {
      token: body.token,
      new_password: body.new_password
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { detail: error.response?.data?.detail || "Lien invalide ou expiré" },
        { status: error.response?.status || 400 }
      );
    }
    return NextResponse.json({ detail: 'Erreur serveur' }, { status: 500 });
  }
}