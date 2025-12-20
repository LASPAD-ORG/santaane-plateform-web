import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { generateWelcomeEmailHTML, generateWelcomeEmailText } from '@/lib/email/templates/welcome-email';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST /api/users/send-welcome-email
 * Envoie un email de bienvenue à un nouvel utilisateur avec ses identifiants
 * 
 * Body: { 
 *   email: string, 
 *   prenom: string, 
 *   nom: string, 
 *   temporaryPassword: string 
 * }
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
    const { email, prenom, nom, temporaryPassword } = body;

    if (!email || !prenom || !nom || !temporaryPassword) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis (email, prenom, nom, temporaryPassword)' },
        { status: 400 }
      );
    }

    console.log('Sending welcome email to:', email);

    // Appel à l'API backend pour envoyer l'email
    // Si le backend n'a pas d'endpoint dédié, on peut utiliser un service d'email
    // Générer le contenu de l'email
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;
    const emailData = {
      prenom,
      nom,
      email,
      temporaryPassword,
      loginUrl,
    };

    const htmlContent = generateWelcomeEmailHTML(emailData);
    const textContent = generateWelcomeEmailText(emailData);

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/users/send-welcome-email`,
        {
          email,
          fullName: `${prenom} ${nom}`,
          temporaryPassword,
          htmlContent,
          textContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Welcome email sent successfully to:', email);
      return NextResponse.json(
        { message: 'Email de bienvenue envoyé avec succès' },
        { status: 200 }
      );
    } catch (backendError) {
      // Si le backend n'a pas l'endpoint, on simule l'envoi pour le moment
      // Dans un environnement de production, vous devriez utiliser un service comme SendGrid, AWS SES, etc.
      console.warn('Backend email endpoint not available, simulating email send');
      
      // Afficher l'email dans les logs (version texte)
      console.log('========================================');
      console.log('EMAIL DE BIENVENUE (SIMULATION)');
      console.log('========================================');
      console.log(textContent);
      console.log('========================================');

      return NextResponse.json(
        { 
          message: 'Email de bienvenue préparé (simulation)',
          warning: 'Service d\'email non configuré - vérifiez les logs du serveur'
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Send welcome email error:', error);

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
          error: error.response?.data?.detail || 'Erreur lors de l\'envoi de l\'email'
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
