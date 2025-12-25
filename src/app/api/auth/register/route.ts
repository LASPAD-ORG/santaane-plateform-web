import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Route d'inscription proxy
 * Sécurité : Cette route crée l'utilisateur mais ne génère pas de cookie de session
 * car le compte doit d'abord être activé via OTP.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Proxy Registration attempt for:', body.email);

    // 1. Appel au backend Python pour créer l'utilisateur
    // Le backend va générer l'OTP et envoyer l'email automatiquement
    await axios.post(`${API_URL}/api/v1/auth/register`, {
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      // On propage les champs optionnels s'ils existent
      profilePhoto: body.profilePhoto || null,
      orcidId: body.orcidId || null
    });

    console.log('Registration successful on backend, OTP sent.');

    // 2. On retourne un succès simple
    // Le frontend (RegisterForm.tsx) interceptera ce 201 pour rediriger vers /verify-otp
    return NextResponse.json(
      { 
        success: true, 
        message: "Utilisateur créé. Vérification OTP requise.",
        email: body.email 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Register proxy error:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 400;
      const detail = error.response?.data?.detail || "Erreur lors de l'inscription";
      
      return NextResponse.json(
        { error: detail },
        { status: status }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}