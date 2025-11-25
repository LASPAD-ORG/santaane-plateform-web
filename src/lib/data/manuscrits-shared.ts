// Données partagées pour les manuscrits - Centralisation des données
// Cette approche permet de maintenir une cohérence entre les différentes vues

export interface BaseManuscrit {
  id: string;
  titre: string;
  description: string;
  auteurId: string;
  auteurNom: string;
  auteurPrenom: string;
  statut: 'brouillon' | 'en_attente' | 'publie' | 'archive';
  dateCreation: string;
  dateMiseAJour: string;
  contenu?: string;
  nombreCommentaires: number;
  mentorId?: string;
  // Métadonnées pour la gestion
  metadata?: {
    specialites?: string[];
    type?: 'roman' | 'poesie' | 'essai' | 'nouvelle' | 'autre';
    volume?: number; // nombre de pages
  };
}

// Base de données centralisée des manuscrits
export const MANUSCRITS_DATABASE: BaseManuscrit[] = [
  {
    id: 'ms1',
    titre: 'Les voix du Sahel',
    description: 'Une exploration poétique des traditions orales sahéliennes',
    auteurId: '1',
    auteurNom: 'Diallo',
    auteurPrenom: 'Amadou',
    statut: 'en_attente',
    dateCreation: '2024-01-15T10:00:00Z',
    dateMiseAJour: '2024-01-20T16:30:00Z',
    nombreCommentaires: 5,
    mentorId: 'mentor-1',
    contenu: `# Les Voix du Sahel

## Préface

Le Sahel, cette bande de terre qui sépare le désert de la savane, a toujours été le creuset d'une riche tradition orale. À travers les siècles, griots, conteurs et sages ont transmis la mémoire collective de nos peuples.

## Chapitre 1 : L'héritage des ancêtres

Les voix d'autrefois résonnent encore dans le vent du soir...

*Sous l'arbre à palabres, le vieux Mamadou raconte :*

"Mes enfants, écoutez bien l'histoire de nos ancêtres qui ont traversé les sables pour s'installer sur ces terres fertiles. Leur courage et leur sagesse nous guident encore aujourd'hui."

## Chapitre 2 : Les chants de la terre

La terre du Sahel chante à qui sait l'écouter. Chaque grain de sable porte en lui la mémoire des caravanes, chaque acacia abrite les secrets des voyageurs d'antan.

## Chapitre 3 : Transmission

Les jeunes générations doivent apprendre à écouter ces voix ancestrales pour ne pas perdre leur identité dans le monde moderne qui change.`,
    metadata: {
      specialites: ['Littérature africaine', 'Poésie', 'Tradition orale'],
      type: 'poesie',
      volume: 85
    }
  },
  {
    id: 'ms2',
    titre: 'Contes de grand-mère',
    description: 'Recueil de contes traditionnels revisités pour les nouvelles générations',
    auteurId: '1',
    auteurNom: 'Diallo',
    auteurPrenom: 'Amadou',
    statut: 'brouillon',
    dateCreation: '2024-01-18T09:15:00Z',
    dateMiseAJour: '2024-01-22T11:45:00Z',
    nombreCommentaires: 2,
    mentorId: 'mentor-1',
    contenu: `# Contes de Grand-mère

## Introduction

Ma grand-mère Aïssata avait le don de transformer les soirées ordinaires en moments magiques. Assise sous la véranda, elle nous racontait des histoires qui nous transportaient dans des mondes fantastiques.

## Le conte du lièvre et de l'éléphant

Il était une fois, dans la grande forêt d'Afrique, un petit lièvre très malin qui défia le puissant éléphant...

(Le développement de cette histoire nécessite encore du travail pour enrichir les personnages secondaires et les dialogues)

## La princesse et l'oiseau de feu

Une princesse courageuse part à la recherche de l'oiseau de feu pour sauver son royaume de la sécheresse...

## La sagesse du baobab

Le vieux baobab détient tous les secrets de la savane. Un jeune homme impatient apprend la valeur de la patience...`,
    metadata: {
      specialites: ['Littérature africaine', 'Contes', 'Jeunesse'],
      type: 'nouvelle',
      volume: 120
    }
  },
  {
    id: 'ms3',
    titre: 'Mémoires d\'un village',
    description: 'Chronique historique d\'un village malien à travers les décennies',
    auteurId: '1',
    auteurNom: 'Diallo',
    auteurPrenom: 'Amadou',
    statut: 'publie',
    dateCreation: '2024-01-05T14:20:00Z',
    dateMiseAJour: '2024-01-12T10:15:00Z',
    nombreCommentaires: 8,
    mentorId: 'mentor-1',
    contenu: `# Mémoires d'un Village

## Prologue

Sanankoro n'est qu'un point sur la carte du Mali, mais pour ceux qui y ont grandi, c'est tout un univers. Ce village a vu passer l'histoire : la colonisation, l'indépendance, la modernisation. Voici son récit.

## Première partie : Les racines (1950-1960)

### Chapitre 1 : Avant l'indépendance

En 1955, Sanankoro comptait 847 habitants. Le chef de village, Ba Mamadou, était respecté de tous. La vie suivait le rythme des saisons et des traditions ancestrales.

Le matin, les femmes se rendaient au puits central. C'était le lieu de tous les échanges, des nouvelles fraîches aux conseils de grand-mère. Les hommes partaient aux champs ou s'occupaient du bétail.

### Chapitre 2 : Les vents du changement

L'école française s'installait progressivement. Certains parents résistaient : "Pourquoi nos enfants ont-ils besoin d'apprendre à écrire dans une langue étrangère ?" D'autres y voyaient une opportunité d'avenir.

## Deuxième partie : L'indépendance (1960-1980)

### Chapitre 3 : L'euphorie des premiers jours

Le 22 septembre 1960 résonne encore dans ma mémoire. Le drapeau vert-jaune-rouge flottait fièrement au-dessus de la place du village. Nous étions libres !

### Chapitre 4 : Les défis de la modernité

Les années 70 apportèrent l'électricité et la route goudronnée. Le village changeait de visage. Les jeunes partaient étudier en ville et ne revenaient pas tous.

## Troisième partie : Vers l'avenir (1980-2020)

### Chapitre 5 : La diaspora

Aujourd'hui, les enfants de Sanankoro vivent à Bamako, Abidjan, Paris ou New York. Ils envoient de l'argent et reviennent pour les fêtes, mais le village n'est plus le même.

### Chapitre 6 : La résistance du temps

Malgré tout, l'âme de Sanankoro survit. L'arbre à palabres est toujours là. Les anciens transmettent encore leur sagesse. Et parfois, dans le silence du soir, on entend encore les voix d'autrefois.

## Épilogue

Sanankoro n'est pas seulement mon village natal. C'est le symbole de l'Afrique moderne qui lutte pour préserver son identité tout en embrassant l'avenir. Cette chronique est un hommage à tous ces villages qui sont les gardiens de notre mémoire collective.`,
    metadata: {
      specialites: ['Histoire', 'Anthropologie', 'Littérature africaine'],
      type: 'essai',
      volume: 250
    }
  },
  {
    id: 'ms4',
    titre: 'Entre deux mondes',
    description: 'Roman sur l\'immigration et l\'identité culturelle d\'une jeune femme africaine en France',
    auteurId: '2',
    auteurNom: 'Traoré',
    auteurPrenom: 'Fatoumata',
    statut: 'en_attente',
    dateCreation: '2024-01-12T08:00:00Z',
    dateMiseAJour: '2024-01-23T15:20:00Z',
    nombreCommentaires: 7,
    mentorId: 'mentor-1',
    contenu: `# Entre Deux Mondes

## Partie I : Le Départ

### Chapitre 1 : Les adieux

Aïsha regardait une dernière fois le paysage de son enfance depuis la fenêtre de l'autobus qui l'emmenait vers l'aéroport de Bamako. Les baobabs majestueux, les cases en banco, les enfants qui couraient pieds nus dans la poussière rouge - tout cela allait lui manquer.

"Tu reviendras, ma fille", lui avait dit sa mère en pleurant. "N'oublie jamais d'où tu viens."

L'avion pour Paris décollait dans quatre heures. Aïsha serrait contre elle son sac contenant ses maigres affaires et surtout, le bracelet en or que lui avait donné sa grand-mère.

### Chapitre 2 : L'arrivée

L'aéroport Charles de Gaulle était un labyrinthe de verre et d'acier. Les annonces en français résonnaient dans les haut-parleurs, mais Aïsha avait du mal à comprendre cet accent si différent de celui qu'on lui avait enseigné à l'école.

Son oncle Moussa l'attendait à la sortie, tenant une pancarte avec son nom. Il avait changé : costume-cravate, chaussures cirées, plus rien du berger qu'elle avait connu enfant.

"Bienvenue en France, ma nièce", dit-il en français avant de revenir au bambara. "Ici, il faut apprendre vite si tu veux t'en sortir."

## Partie II : L'Adaptation

### Chapitre 3 : La banlieue parisienne

Le HLM de Sarcelles où vivait oncle Moussa ressemblait à une fourmilière géante. Aïsha partageait une chambre avec sa cousine Rama, née en France mais qui parlait encore parfaitement le bambara.

"Tu verras", lui expliquait Rama, "ici tu es ni tout à fait africaine, ni tout à fait française. Il faut naviguer entre les deux."

### Chapitre 4 : L'école

Le lycée était un choc. Les élèves semblaient si libres, si décontractés. Les filles portaient des jupes courtes, les garçons parlaient fort. Aïsha, avec son français châtié et ses robes longues, se sentait invisible.

Madame Dubois, sa professeure de littérature, fut la première à remarquer ses dissertations brillantes.

"Vous avez un talent particulier pour l'écriture, Aïsha. Avez-vous pensé aux études supérieures ?"

## Partie III : La Quête d'Identité

### Chapitre 5 : Les premiers amours

Jean-Baptiste était different des garçons de son quartier. Étudiant en philosophie à la Sorbonne, il s'intéressait sincèrement à la culture africaine. Avec lui, Aïsha découvrait Paris : les musées, les librairies, les cafés de Saint-Germain.

Mais quand elle le présenta à sa famille, le malaise était palpable. Et quand elle rencontra les parents de Jean-Baptiste - bourgeois du 16ème arrondissement - elle comprit qu'elle dérangeait.

### Chapitre 6 : Le retour au pays

Cinq ans après son départ, Aïsha retourna au Mali pour les funérailles de sa grand-mère. Le choc fut violent. Elle qui se sentait étrangère en France se sentait maintenant étrangère dans son propre pays.

"Tu as changé", lui dit sa mère. "Tu marches comme eux, tu parles comme eux. Tu es devenue une toubabou."

### Chapitre 7 : L'acceptation

De retour à Paris, Aïsha comprit qu'elle n'avait pas à choisir. Elle était les deux à la fois : malienne et française, africaine et européenne. Son identité était multiple, et c'était sa force.

Elle commença à écrire son premier roman, mêlant le français de Molière et les proverbes bambara de sa grand-mère.

## Épilogue

Aujourd'hui, Aïsha est devenue écrivaine. Ses livres parlent de cette génération qui vit "entre deux mondes", ces enfants de l'immigration qui enrichissent la France de leur diversité tout en gardant leurs racines africaines.

Elle a appris qu'on peut appartenir à plusieurs cultures à la fois, que l'identité n'est pas un carcan mais un jardin où poussent mille fleurs différentes.

Son dernier livre se termine par cette phrase : "Je ne suis pas à moitié malienne et à moitié française. Je suis entièrement les deux."`,
    metadata: {
      specialites: ['Roman', 'Immigration', 'Identité culturelle'],
      type: 'roman',
      volume: 320
    }
  },
  {
    id: 'ms5',
    titre: 'La maison jaune',
    description: 'Nouvelle nostalgique sur les souvenirs d\'enfance dans une maison familiale',
    auteurId: '2',
    auteurNom: 'Traoré',
    auteurPrenom: 'Fatoumata',
    statut: 'brouillon',
    dateCreation: '2024-01-16T13:30:00Z',
    dateMiseAJour: '2024-01-21T17:45:00Z',
    nombreCommentaires: 3,
    mentorId: 'mentor-1',
    contenu: `# La Maison Jaune

La maison jaune de mon enfance se dresse encore dans ma mémoire, intacte malgré les années qui ont passé. Ses murs couleur soleil couchant, sa véranda ombragée où grand-père fumait sa pipe, son jardin où poussaient les goyaviers et les manguiers...

## Les matins d'été

Je me réveillais avec le chant du coq de Madame Konaté, la voisine. La lumière filtrait à travers les rideaux de crochet que maman avait cousus elle-même. L'odeur du café grillé montait de la cuisine où grand-mère préparait le petit déjeuner.

C'était l'époque bénie où le temps n'existait pas, où une journée durait une éternité et où chaque coin de la maison recélait des trésors.

## La chambre aux secrets

Dans le grenier, derrière une vieille malle, j'avais découvert une boîte remplie de photos en noir et blanc. Papa enfant, en culottes courtes. Maman le jour de son mariage, radieuse dans sa robe blanche. Grand-père en uniforme, avant de partir à la guerre.

Ces images étaient mes livres d'histoire préférés.

## Le jardin des merveilles

Derrière la maison s'étendait un jardin que j'imaginais immense. Il y avait l'arbre à palabres - un vieux manguier - sous lequel nous nous réunissions le soir. Grand-père nous racontait des histoires de son enfance, quand il gardait les zébus dans la brousse.

## L'hiver de la séparation

Puis un jour, papa a parlé de déménagement, de nouvelles opportunités en ville. La maison jaune fut vendue à des étrangers qui la transformèrent, effaçant peu à peu les traces de notre passage.

## Retour

Quarante ans plus tard, j'ai revu la maison jaune. Elle était devenue blanche, moderne, méconnaissable. Seul le vieux manguier était encore là, fidèle gardien de mes souvenirs.

J'ai compris ce jour-là que nous ne quittons jamais vraiment la maison de notre enfance. Elle vit en nous, refuge éternel de nos plus beaux souvenirs.

*Note de l'auteur : Cette nouvelle nécessite encore du travail pour développer l'aspect nostalgique et enrichir les descriptions sensorielles.*`,
    metadata: {
      specialites: ['Nouvelle', 'Autobiographie', 'Nostalgie'],
      type: 'nouvelle',
      volume: 45
    }
  },
  {
    id: 'ms6',
    titre: 'Réflexions sur l\'éducation moderne',
    description: 'Essai critique sur les systèmes éducatifs contemporains et leurs défis',
    auteurId: '3',
    auteurNom: 'Sow',
    auteurPrenom: 'Ibrahim',
    statut: 'brouillon',
    dateCreation: '2024-01-20T10:45:00Z',
    dateMiseAJour: '2024-01-24T14:30:00Z',
    nombreCommentaires: 1,
    mentorId: 'mentor-1',
    contenu: `# Réflexions sur l'Éducation Moderne

## Introduction

L'éducation traverse une crise sans précédent. Entre les défis technologiques, les inégalités sociales croissantes et la remise en question des méthodes traditionnelles, il est temps de repenser fondamentalement notre approche pédagogique.

## I. Le constat d'échec

### A. L'inadaptation aux réalités contemporaines

Le système éducatif actuel forme encore les élèves pour un monde qui n'existe plus. Basé sur le modèle industriel du XIXe siècle, il privilégie la standardisation sur la personnalisation, la mémorisation sur la créativité.

### B. Les inégalités persistantes

Malgré les discours sur l'égalité des chances, l'école reproduit et amplifie les inégalités sociales. Les enfants des classes populaires restent désavantagés dans un système qui favorise implicitement les codes culturels dominants.

## II. Les défis du numérique

### A. La révolution technologique

L'irruption du numérique dans l'éducation n'est pas qu'une évolution technique, c'est une révolution anthropologique. Les jeunes d'aujourd'hui pensent, apprennent et communiquent différemment de leurs prédécesseurs.

### B. Les nouvelles compétences

Il faut enseigner l'esprit critique face aux fake news, la maîtrise des outils numériques, la collaboration à distance. Ces compétences du XXIe siècle sont absentes des curricula traditionnels.

## III. Vers une pédagogie humaniste

### A. La personnalisation des apprentissages

Chaque enfant est unique. Il faut développer des approches pédagogiques qui respectent les rythmes, les styles et les talents de chacun. L'intelligence artificielle peut nous y aider.

### B. L'apprentissage par projet

Plutôt que d'enseigner des matières cloisonnées, favorisons les projets interdisciplinaires qui donnent du sens aux apprentissages et développent l'autonomie des élèves.

## IV. Le rôle de l'enseignant

### A. Du transmetteur au facilitateur

L'enseignant ne peut plus être seulement un transmetteur de savoirs. Il devient un facilitateur d'apprentissages, un guide qui aide l'élève à construire ses propres connaissances.

### B. Formation et reconnaissance

Cette évolution du métier nécessite une refonte complète de la formation des enseignants et une revalorisation de leur statut social.

## Conclusion provisoire

*Ce document nécessite encore un développement approfondi. Plusieurs pistes restent à explorer :*

- *L'analyse comparative des systèmes éducatifs internationaux*
- *L'impact de la crise sanitaire sur l'éducation*
- *Les innovations pédagogiques émergentes*
- *Le financement de l'éducation*

*Les arguments avancés mériteraient d'être étayés par des données empiriques et des références théoriques solides.*`,
    metadata: {
      specialites: ['Éducation', 'Pédagogie', 'Philosophie'],
      type: 'essai',
      volume: 180
    }
  }
];

// Fonction pour obtenir les manuscrits par auteur
export function getManuscritsByAuteur(auteurId: string): BaseManuscrit[] {
  return MANUSCRITS_DATABASE.filter(manuscrit => manuscrit.auteurId === auteurId);
}

// Fonction pour obtenir un manuscrit par ID
export function getManuscritById(id: string): BaseManuscrit | undefined {
  return MANUSCRITS_DATABASE.find(manuscrit => manuscrit.id === id);
}

// Fonction pour obtenir tous les manuscrits avec filtres optionnels
export function getAllManuscrits(filters?: {
  statut?: BaseManuscrit['statut'];
  mentorId?: string;
  auteurId?: string;
}): BaseManuscrit[] {
  let results = [...MANUSCRITS_DATABASE];
  
  if (filters?.statut) {
    results = results.filter(m => m.statut === filters.statut);
  }
  
  if (filters?.mentorId) {
    results = results.filter(m => m.mentorId === filters.mentorId);
  }
  
  if (filters?.auteurId) {
    results = results.filter(m => m.auteurId === filters.auteurId);
  }
  
  return results;
}

// Fonction pour obtenir les statistiques des manuscrits
export function getManuscritsStats() {
  return {
    total: MANUSCRITS_DATABASE.length,
    parStatut: {
      brouillon: MANUSCRITS_DATABASE.filter(m => m.statut === 'brouillon').length,
      en_attente: MANUSCRITS_DATABASE.filter(m => m.statut === 'en_attente').length,
      publie: MANUSCRITS_DATABASE.filter(m => m.statut === 'publie').length,
      archive: MANUSCRITS_DATABASE.filter(m => m.statut === 'archive').length,
    },
    totalCommentaires: MANUSCRITS_DATABASE.reduce((acc, m) => acc + m.nombreCommentaires, 0)
  };
}