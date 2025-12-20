export function formatCategoryDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getCategoryHierarchy(
  category: any,
  allCategories: any[]
): string[] {
  const hierarchy: string[] = [category.name];
  let current = category;

  while (current.parentId) {
    const parent = allCategories.find((c) => c.id === current.parentId);
    if (!parent) break;
    hierarchy.unshift(parent.name);
    current = parent;
  }

  return hierarchy;
}

export function formatCategoryPath(hierarchy: string[]): string {
  return hierarchy.join(' > ');
}

export function countChildCategories(
  parentId: string,
  allCategories: any[]
): number {
  return allCategories.filter((c) => c.parentId === parentId).length;
}

export function getTotalManuscriptCount(
  categoryId: string,
  allCategories: any[]
): number {
  const category = allCategories.find((c) => c.id === categoryId);
  if (!category) return 0;

  const children = allCategories.filter((c) => c.parentId === categoryId);
  const childrenCount = children.reduce(
    (sum, child) => sum + getTotalManuscriptCount(child.id, allCategories),
    0
  );

  return category.manuscriptCount + childrenCount;
}
