export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getEditorRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    CHIEF_EDITOR: 'Rédacteur en chef',
    ASSOCIATE_EDITOR: 'Rédacteur associé',
    HANDLING_EDITOR: 'Rédacteur en charge',
    SECTION_EDITOR: 'Rédacteur de section',
    GUEST_EDITOR: 'Rédacteur invité',
  };
  return labels[role] || role;
}
