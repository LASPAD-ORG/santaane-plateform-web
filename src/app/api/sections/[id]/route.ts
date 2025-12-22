import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/sections/[id]
 * PUT /api/sections/[id]
 * DELETE /api/sections/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const token = request.cookies.get('auth_token')?.value;
        console.log(`Fetching section ${id} from backend:`, `${API_URL}/api/v1/sections/${id}/`);

        const response = await axios.get(`${API_URL}/api/v1/sections/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`Section ${id} fetched successfully. Data type:`, typeof response.data);

        // Handle potential wrapping (though less likely for single item)
        let section = response.data;
        if (section && !section.id && (section.results || section.items)) {
            section = (section.results || section.items)[0];
        }

        return NextResponse.json(section, { status: 200 });
    } catch (error) {
        console.error(`GET /api/sections/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.detail || 'Erreur lors de la récupération de la section' },
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
        console.log(`Updating section ${id} with data:`, body);

        const response = await axios.put(`${API_URL}/api/v1/sections/${id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error(`PUT /api/sections/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            console.error('Backend error detail:', JSON.stringify(error.response?.data, null, 2));
            return NextResponse.json(
                {
                    error: 'Erreur lors de la modification de la section',
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
        console.log(`Deleting section ${id} from backend:`, `${API_URL}/api/v1/sections/${id}`);

        const response = await axios.delete(`${API_URL}/api/v1/sections/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error(`DELETE /api/sections/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.detail || 'Erreur lors de la suppression de la section' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
