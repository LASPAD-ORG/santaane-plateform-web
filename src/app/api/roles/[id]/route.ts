import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/roles/[id]
 * PUT /api/roles/[id]
 * DELETE /api/roles/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const token = request.cookies.get('auth_token')?.value;
        console.log(`Fetching role ${id} from backend:`, `${API_URL}/api/v1/roles/${id}/`);

        const response = await axios.get(`${API_URL}/api/v1/roles/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`Role ${id} fetched successfully. Data type:`, typeof response.data);

        // Handle potential wrapping (though less likely for single item)
        let role = response.data;
        if (role && !role.id && (role.results || role.items)) {
            role = (role.results || role.items)[0];
        }

        return NextResponse.json(role, { status: 200 });
    } catch (error) {
        console.error(`GET /api/roles/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.detail || 'Erreur lors de la récupération du rôle' },
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
        console.log(`Updating role ${id} with data:`, body);

        const response = await axios.put(`${API_URL}/api/v1/roles/${id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error(`PUT /api/roles/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            console.error('Backend error detail:', JSON.stringify(error.response?.data, null, 2));
            return NextResponse.json(
                {
                    error: 'Erreur lors de la modification du rôle',
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
        console.log(`Deleting role ${id} from backend:`, `${API_URL}/api/v1/roles/${id}`);

        const response = await axios.delete(`${API_URL}/api/v1/roles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error(`DELETE /api/roles/${id} error:`, error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.detail || 'Erreur lors de la suppression du rôle' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
