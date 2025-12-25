import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Appel au backend Python (AuthService.resend_otp)
    // Le backend gère la limite de 5 envois par jour
    const response = await axios.post(`${API_URL}/api/v1/auth/resend-otp`, {
      email
    });

    return NextResponse.json(
      { success: true, message: response.data },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP Resend error:', error);

    if (axios.isAxiosError(error)) {
      // Gère notamment l'erreur 429 (Too Many Requests) si la limite de 5 est atteinte
      return NextResponse.json(
        { error: error.response?.data?.detail || "Impossible de renvoyer le code" },
        { status: error.response?.status || 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}