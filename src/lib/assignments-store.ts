// Stockage centralisé des assignations pour partage entre les endpoints
export interface MentorAssignment {
  id: string;
  mentorId: string;
  authorId: string;
  mentor: any;
  author: any;
  assignedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Stockage en mémoire partagé
export const assignmentsStore: MentorAssignment[] = [];

// Fonctions utilitaires pour gérer les assignations
export const addAssignment = (assignment: MentorAssignment) => {
  assignmentsStore.push(assignment);
};

export const findActiveAssignmentByAuthor = (authorId: string) => {
  return assignmentsStore.find(
    assignment => assignment.authorId === authorId && assignment.status === 'ACTIVE'
  );
};

export const getAssignmentsByMentor = (mentorId: string) => {
  return assignmentsStore.filter(
    assignment => assignment.mentorId === mentorId && assignment.status === 'ACTIVE'
  );
};

export const getAllAssignments = () => {
  return assignmentsStore;
};

export const removeAssignment = (assignmentId: string) => {
  const index = assignmentsStore.findIndex(assignment => assignment.id === assignmentId);
  if (index !== -1) {
    assignmentsStore.splice(index, 1);
    return true;
  }
  return false;
};

export const findAssignmentById = (assignmentId: string) => {
  return assignmentsStore.find(assignment => assignment.id === assignmentId);
};
