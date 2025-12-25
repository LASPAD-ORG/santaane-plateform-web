import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Récupérer le manuscrit d'abord pour avoir le nom du fichier
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return new Response('Non autorisé', { status: 401 });
    }

    const resolvedParams = await params;
    const manuscriptId = resolvedParams.id;

    // Récupérer les informations du manuscrit
    const manuscriptResponse = await fetch(`${API_URL}/api/v1/manuscripts/my-assignments`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!manuscriptResponse.ok) {
      return new Response('Manuscrit non trouvé', { status: 404 });
    }

    const manuscripts = await manuscriptResponse.json();
    const manuscript = manuscripts.find((m: any) => m.id === parseInt(manuscriptId));

    if (!manuscript) {
      return new Response('Manuscrit non trouvé', { status: 404 });
    }

    // Télécharger le PDF
    const pdfResponse = await fetch(`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!pdfResponse.ok) {
      return new Response('PDF non trouvé', { status: 404 });
    }

    // Retourner le PDF avec les headers appropriés
    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${manuscript.pdfFilename}"`,
      },
    });
    
  } catch (error) {
    console.error('Erreur téléchargement PDF:', error);
    return new Response('Erreur interne', { status: 500 });
  }
}