import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log('[Evaluator Manuscripts] Token exists:', !!token);

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    console.log('[Evaluator Manuscripts] Calling backend:', `${API_URL}/api/v1/manuscripts/my-assignments`);

    const response = await axios.get(
      `${API_URL}/api/v1/manuscripts/my-assignments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('[Evaluator Manuscripts] Success, got', response.data?.length || 0, 'manuscripts');

    // Enrichir chaque manuscrit avec l'état d'évaluation basé sur l'API backend
    const manuscriptsWithEvaluationStatus = await Promise.all(
      response.data.map(async (manuscript: any) => {
        try {
          let evaluationStatus = 'in_progress'; // Par défaut, considérer comme en cours
          
          // Utiliser l'API d'évaluation status du backend qui fonctionne
          try {
            const statusResponse = await axios.get(
              `${API_URL}/api/v1/manuscripts/${manuscript.id}/evaluation-status`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            const statusData = statusResponse.data;
            console.log(`[Manuscripts] Manuscrit ${manuscript.id} status API:`, statusData);
            
            if (statusData && statusData.evaluationStatus) {
              // Mapper les statuts du backend vers nos statuts frontend simplifiés
              switch (statusData.evaluationStatus) {
                case 'completed':
                  evaluationStatus = 'completed';
                  // Essayer de récupérer la date de soumission depuis la grille
                  try {
                    const gridResponse = await axios.get(
                      `${API_URL}/api/v1/manuscripts/${manuscript.id}/evaluation-grid`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    
                    const grid = gridResponse.data;
                    console.log(`[Manuscripts] Manuscrit ${manuscript.id} grille complète:`, grid);
                    if (grid && grid.submittedAt) {
                      manuscript.evaluationSubmittedAt = grid.submittedAt;
                      console.log(`[Manuscripts] Manuscrit ${manuscript.id} soumis le:`, grid.submittedAt);
                    } else if (grid && grid.updatedAt) {
                      // Fallback: utiliser updatedAt si submittedAt n'existe pas
                      manuscript.evaluationSubmittedAt = grid.updatedAt;
                      console.log(`[Manuscripts] Manuscrit ${manuscript.id} fallback updatedAt:`, grid.updatedAt);
                    } else {
                      console.log(`[Manuscripts] Manuscrit ${manuscript.id} pas de date de soumission trouvée`);
                    }
                  } catch (gridError) {
                    console.log(`[Manuscripts] Impossible de récupérer la date de soumission pour manuscrit ${manuscript.id}`);
                  }
                  break;
                case 'in_progress':
                case 'not_started':
                default:
                  evaluationStatus = 'in_progress';
                  break;
              }
            }
            
          } catch (statusError: any) {
            console.log(`[Manuscripts] Erreur status API pour manuscrit ${manuscript.id}:`, statusError.response?.status, statusError.message);
            
            // Fallback : vérifier les annotations comme indicateur
            try {
              const annotationsResponse = await axios.get(
                `${API_URL}/api/v1/manuscripts/${manuscript.id}/annotations`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              
              const annotations = annotationsResponse.data || [];
              console.log(`[Manuscripts] Manuscrit ${manuscript.id} a ${annotations.length} annotations (fallback)`);
              
              if (annotations.length > 0) {
                evaluationStatus = 'in_progress';
              }
              
            } catch (annotationError) {
              console.log(`[Manuscripts] Erreur annotations pour manuscrit ${manuscript.id}:`, annotationError);
              // Garder in_progress par défaut
            }
          }
          
          console.log(`[Manuscripts] Manuscrit ${manuscript.id} statut final: ${evaluationStatus}`);
          
          return {
            ...manuscript,
            evaluationStatus
          };
        } catch (error) {
          console.warn(`Erreur lors du calcul du statut pour le manuscrit ${manuscript.id}:`, error);
          return {
            ...manuscript,
            evaluationStatus: 'in_progress'
          };
        }
      })
    );

    return NextResponse.json(manuscriptsWithEvaluationStatus);
  } catch (error: any) {
    console.error('[Evaluator Manuscripts] Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Accès interdit - rôle évaluateur requis', details: error.response?.data },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des manuscrits assignés' },
      { status: error.response?.status || 500 }
    );
  }
}
