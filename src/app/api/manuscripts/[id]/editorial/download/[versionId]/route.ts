import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await context.params;
    const token = request.cookies.get('auth_token')?.value;

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/detail/${id}/editorial-download/${versionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer',
      }
    );

    // Récupérer le nom du fichier depuis le backend (si disponible dans les headers)
    const contentDisposition = response.headers['content-disposition'];
    let filename = `version_${versionId}.docx`; // Valeur par défaut

    // Extraire le filename du header Content-Disposition si présent
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ detail: "Fichier introuvable" }, { status: 404 });
  }
}