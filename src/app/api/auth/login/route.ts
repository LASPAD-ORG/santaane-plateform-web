import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt:', { email, API_URL });

    // Create form data for OAuth2 format
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    // Call backend API
    const response = await axios.post(
      `${API_URL}/api/v1/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('Login successful');

    const { access_token } = response.data;

    // Create response
    const apiResponse = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Set HTTP-Only cookie with the token
    apiResponse.cookies.set('auth_token', access_token, {
      httpOnly: true, // ✅ Cookie inaccessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // ✅ HTTPS en production
      sameSite: 'lax', // ✅ Protection CSRF
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    return apiResponse;
  } catch (error) {
    console.error('Login error:', error);

    if (axios.isAxiosError(error)) {
      console.error('Backend response:', error.response?.data);
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Identifiants incorrects',
        },
        { status: error.response?.status || 401 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
