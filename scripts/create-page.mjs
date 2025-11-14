#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import templates
import getPageTemplate from './templates/page.template.mjs';
import getValidatorsTemplate from './templates/validators.template.mjs';
import getFetcherGetTemplate from './templates/fetcher-get.template.mjs';
import getFetcherCreateTemplate from './templates/fetcher-create.template.mjs';
import getCardTemplate from './templates/card.template.mjs';
import getFormattersTemplate from './templates/formatters.template.mjs';

// Available roles
const ROLES = [
  { name: 'SUPER_ADMIN - Super Administrateur', value: 'SUPER_ADMIN' },
  { name: 'EDITOR - Éditeur', value: 'EDITOR' },
  { name: 'EVALUATOR - Évaluateur', value: 'EVALUATOR' },
  { name: 'MENTOR - Mentor', value: 'MENTOR' },
  { name: 'AUTHOR - Auteur', value: 'AUTHOR' },
];

// Common Material-UI icons
const COMMON_ICONS = [
  'Article',
  'Dashboard',
  'People',
  'Settings',
  'Assessment',
  'Assignment',
  'Book',
  'Category',
  'Description',
  'Event',
  'Folder',
  'Grade',
  'Group',
  'Home',
  'Info',
  'Label',
  'LibraryBooks',
  'List',
  'Lock',
  'Mail',
  'Notes',
  'Notifications',
  'Pages',
  'PersonAdd',
  'Public',
  'Schedule',
  'School',
  'Science',
  'Star',
  'Storage',
  'ThumbUp',
  'Timeline',
  'TrendingUp',
  'ViewList',
  'Work',
];

// Utility functions
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function validatePageName(input) {
  if (!input || input.trim().length === 0) {
    return 'Le nom de la page est requis';
  }
  if (!/^[a-z0-9-]+$/.test(input)) {
    return 'Le nom doit contenir uniquement des lettres minuscules, chiffres et tirets';
  }

  const pagePath = path.join(process.cwd(), 'src', 'app', '(dashboard)', input);
  if (fs.existsSync(pagePath)) {
    return `La page "${input}" existe déjà`;
  }

  return true;
}

function validateRoute(input) {
  if (!input || input.trim().length === 0) {
    return 'La route est requise';
  }
  if (!input.startsWith('/')) {
    return 'La route doit commencer par /';
  }
  return true;
}

// Create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Write file with content
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

// Update roles.ts to add the new menu item
function updateRolesConfig(pageName, displayName, iconName, route, allowedRoles) {
  const rolesConfigPath = path.join(process.cwd(), 'src', 'config', 'roles.ts');

  if (!fs.existsSync(rolesConfigPath)) {
    console.error('❌ Fichier roles.ts introuvable');
    return;
  }

  let content = fs.readFileSync(rolesConfigPath, 'utf8');

  // Create the new menu item
  const newMenuItem = `  {
    label: '${displayName}',
    path: '${route}',
    icon: ${iconName},
    allowedRoles: [${allowedRoles.map(r => `UserRole.${r}`).join(', ')}],
  },`;

  // Find the MENU_ITEMS array and add the new item
  const menuItemsRegex = /(export const MENU_ITEMS: MenuItem\[\] = \[)([\s\S]*?)(\];)/;
  const match = content.match(menuItemsRegex);

  if (match) {
    const [fullMatch, before, items, after] = match;
    // Add new item before the closing bracket
    const updatedItems = items.trimEnd() + '\n' + newMenuItem + '\n';
    content = content.replace(fullMatch, before + updatedItems + after);

    // Make sure the icon is imported
    const iconImportRegex = /import \{([^}]+)\} from '@mui\/icons-material';/;
    const iconImportMatch = content.match(iconImportRegex);

    if (iconImportMatch) {
      const currentIcons = iconImportMatch[1].split(',').map(i => i.trim());
      if (!currentIcons.includes(iconName)) {
        currentIcons.push(iconName);
        currentIcons.sort();
        const newImport = `import {\n  ${currentIcons.join(',\n  ')},\n} from '@mui/icons-material';`;
        content = content.replace(iconImportRegex, newImport);
      }
    }

    fs.writeFileSync(rolesConfigPath, content, 'utf8');
    console.log('✅ Menu mis à jour dans roles.ts');
  } else {
    console.error('❌ Impossible de trouver MENU_ITEMS dans roles.ts');
  }
}

// Main CLI function
async function main() {
  console.log('\n🚀 Création d\'une nouvelle page Dashboard\n');

  try {
    // Ask questions
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'pageName',
        message: 'Nom de la page (kebab-case, ex: my-feature):',
        validate: validatePageName,
        filter: (input) => toKebabCase(input.trim()),
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Nom d\'affichage (ex: Ma Fonctionnalité):',
        validate: (input) => input.trim().length > 0 || 'Le nom d\'affichage est requis',
      },
      {
        type: 'list',
        name: 'iconName',
        message: 'Icône Material-UI:',
        choices: COMMON_ICONS,
        pageSize: 15,
      },
      {
        type: 'input',
        name: 'route',
        message: 'Route (ex: /dashboard/my-feature):',
        default: (answers) => `/dashboard/${answers.pageName}`,
        validate: validateRoute,
      },
      {
        type: 'checkbox',
        name: 'allowedRoles',
        message: 'Rôles autorisés (sélection multiple):',
        choices: ROLES,
        validate: (input) => input.length > 0 || 'Sélectionnez au moins un rôle',
      },
    ]);

    const { pageName, displayName, iconName, route, allowedRoles } = answers;
    const featureNamePascal = toPascalCase(pageName);

    console.log('\n📝 Création des fichiers...\n');

    // Base path for the new page
    const basePath = path.join(process.cwd(), 'src', 'app', '(dashboard)', pageName);

    // Create directories
    ensureDir(basePath);
    ensureDir(path.join(basePath, 'checkers'));
    ensureDir(path.join(basePath, 'components'));
    ensureDir(path.join(basePath, 'fetchers'));
    ensureDir(path.join(basePath, 'helpers'));

    // Create files
    console.log(`  ✓ ${pageName}/page.tsx`);
    writeFile(
      path.join(basePath, 'page.tsx'),
      getPageTemplate(pageName, featureNamePascal, iconName)
    );

    console.log(`  ✓ ${pageName}/checkers/validators.ts`);
    writeFile(
      path.join(basePath, 'checkers', 'validators.ts'),
      getValidatorsTemplate(pageName, featureNamePascal)
    );

    console.log(`  ✓ ${pageName}/fetchers/useFetch${featureNamePascal}.ts`);
    writeFile(
      path.join(basePath, 'fetchers', `useFetch${featureNamePascal}.ts`),
      getFetcherGetTemplate(pageName, featureNamePascal)
    );

    console.log(`  ✓ ${pageName}/fetchers/useCreate${featureNamePascal}.ts`);
    writeFile(
      path.join(basePath, 'fetchers', `useCreate${featureNamePascal}.ts`),
      getFetcherCreateTemplate(pageName, featureNamePascal)
    );

    console.log(`  ✓ ${pageName}/components/${featureNamePascal}Card.tsx`);
    writeFile(
      path.join(basePath, 'components', `${featureNamePascal}Card.tsx`),
      getCardTemplate(pageName, featureNamePascal, iconName)
    );

    console.log(`  ✓ ${pageName}/helpers/formatters.ts`);
    writeFile(
      path.join(basePath, 'helpers', 'formatters.ts'),
      getFormattersTemplate(pageName, featureNamePascal)
    );

    // Update roles configuration
    console.log('\n🔧 Mise à jour de la configuration...\n');
    updateRolesConfig(pageName, displayName, iconName, route, allowedRoles);

    console.log('\n✨ Page créée avec succès!\n');
    console.log('📂 Emplacement:', basePath);
    console.log('🔗 Route:', route);
    console.log('👥 Rôles autorisés:', allowedRoles.join(', '));
    console.log('\n💡 Prochaines étapes:');
    console.log('  1. Adapter les endpoints API dans les fetchers');
    console.log('  2. Personnaliser les champs dans validators.ts');
    console.log('  3. Ajuster le composant Card selon vos besoins');
    console.log('  4. Tester la page:', route);
    console.log('');

  } catch (error) {
    if (error.isTtyError) {
      console.error('❌ Prompt non disponible dans cet environnement');
    } else {
      console.error('❌ Erreur:', error.message);
    }
    process.exit(1);
  }
}

// Run the CLI
main();
