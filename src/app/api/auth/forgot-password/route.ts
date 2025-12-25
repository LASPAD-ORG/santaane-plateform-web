import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const response = await axios.post(`${API_URL}/api/v1/auth/forgot-password`, { 
      email 
    });

    // On renvoie directement la donnée du backend pour garder la cohérence
    // Si le backend renvoie une string, Next renverra cette string dans le body
    return NextResponse.json(response.data); 
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // On récupère le message d'erreur précis du backend Python (detail)
      const errorMessage = error.response?.data?.detail || "Erreur lors de la demande";
      return NextResponse.json(
        { detail: errorMessage }, 
        { status: error.response?.status || 400 }
      );
    }
    return NextResponse.json({ detail: 'Erreur serveur interne' }, { status: 500 });
  }
}