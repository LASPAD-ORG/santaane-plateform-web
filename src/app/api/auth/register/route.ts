import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// NEXT_PUBLIC_API_URL est l'URL publique (utilisée dans le navigateur)
// INTERNAL_API_URL est l'URL interne Docker (utilisée côté serveur Node.js)
// Si INTERNAL_API_URL n'est pas définie, on tombe sur NEXT_PUBLIC_API_URL
// Les routes API Next.js s'exécutent côté serveur : pas de Mixed Content, HTTP autorisé
const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

/**
 * Route d'inscription proxy
 * Sécurité : Cette route crée l'utilisateur mais ne génère pas de cookie de session
 * car le compte doit d'abord être activé via OTP.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Proxy Registration attempt for:', body.email);
    console.log('Backend URL used:', API_URL);

    // 1. Appel au backend Python pour créer l'utilisateur
    // Le backend attend du snake_case (Pydantic)
    await axios.post(`${API_URL}/api/v1/auth/register`, {
      email: body.email,
      password: body.password,
      full_name: body.fullName || body.full_name,
      profile_photo: body.profilePhoto || body.profile_photo || null,
      orcid_id: body.orcidId || body.orcid_id || null,
    });

    console.log('Registration successful on backend, OTP sent.');

    // 2. On retourne un succès simple
    // Le frontend (RegisterForm.tsx) interceptera ce 201 pour rediriger vers /verify-otp
    return NextResponse.json(
      {
        success: true,
        message: 'Utilisateur créé. Vérification OTP requise.',
        email: body.email,
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
