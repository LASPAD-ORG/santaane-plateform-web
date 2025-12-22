import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/themes/[id]
 * PUT /api/themes/[id]
 * DELETE /api/themes/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const token = request.cookies.get('auth_token')?.value;
        console.log(`Fetching theme ${id} from backend:`, `${API_URL}/api/v1/themes/${id}/`);

        const response = await axios.get(`${API_URL}/api/v1/themes/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`Theme ${id} fetched successfully. Data type:`, typeof response.data);

        // Handle potential wrapping (though less likely for single item)
        let theme = response.data;
        if (theme && !theme.id && (theme.results || theme.items)) {
            theme = (theme.results || theme.items)[0];
        }

        return NextResponse.json(theme, { status: 200 });
    } catch (error) {
        console.error(`GET /api/themes/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.detail || 'Erreur lors de la récupération du thème' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const token = request.cookies.get('auth_token')?.value;
        const body = await request.json();
        console.log(`Updating theme ${id} with data:`, body);

        const response = await axios.put(`${API_URL}/api/v1/themes/${id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error(`PUT /api/themes/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            console.error('Backend error detail:', JSON.stringify(error.response?.data, null, 2));
            return NextResponse.json(
                {
                    error: 'Erreur lors de la modification du thème',
                    detail: error.response?.data
                },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const token = request.cookies.get('auth_token')?.value;
        console.log(`Deleting theme ${id} from backend:`, `${API_URL}/api/v1/themes/${id}`);

        const response = await axios.delete(`${API_URL}/api/v1/themes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error(`DELETE /api/themes/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.detail || 'Erreur lors de la suppression du thème' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
