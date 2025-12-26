import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Appel au backend Python (AuthService.verify_otp)
    await axios.post(`${API_URL}/api/v1/auth/verify-otp`, {
      email,
      code
    });

    return NextResponse.json(
      { success: true, message: "Compte activé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP Verification error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.detail || "Code invalide ou expiré" },
        { status: error.response?.status || 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}