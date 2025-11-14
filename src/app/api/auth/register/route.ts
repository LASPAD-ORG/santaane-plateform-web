import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call backend API to register
    await axios.post(`${API_URL}/api/v1/auth/register`, body);

    // After registration, login the user
    const formData = new URLSearchParams();
    formData.append('username', body.email);
    formData.append('password', body.password);
    formData.append('grant_type', 'password');

    const loginResponse = await axios.post(
      `${API_URL}/api/v1/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = loginResponse.data;

    // Create response
    const apiResponse = NextResponse.json(
      { success: true },
      { status: 201 }
    );

    // Set HTTP-Only cookie with the token
    apiResponse.cookies.set('auth_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    return apiResponse;
  } catch (error) {
    console.error('Register error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.detail || 'Erreur lors de l\'inscription',
        },
        { status: error.response?.status || 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
