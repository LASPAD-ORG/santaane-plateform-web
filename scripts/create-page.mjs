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

function validateKebabCase(input, fieldName = 'Le champ') {
  if (!input || input.trim().length === 0) {
    return `${fieldName} est requis`;
  }
  if (!/^[a-z0-9-]+$/.test(input)) {
    return 'Doit contenir uniquement des lettres minuscules, chiffres et tirets';
  }
  return true;
}

function validatePathParent(input) {
  if (!input || input.trim().length === 0) {
    return 'Le chemin est requis';
  }
  // Allow slashes for nested paths like "shared/author"
  if (!/^[a-z0-9-/]+$/.test(input)) {
    return 'Doit contenir uniquement des lettres minuscules, chiffres, tirets et slashes';
  }
  return true;
}

function validatePagePath(pathParent, folderName) {
  const pagePath = path.join(process.cwd(), 'src', 'app', '(dashboard)', 'dashboard', pathParent, folderName);
  if (fs.existsSync(pagePath)) {
    return `La page "${pathParent}/${folderName}" existe déjà`;
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
function updateRolesConfig(pageName, displayName, iconName, route, roles) {
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
    roles: [${roles.map(r => `UserRole.${r}`).join(', ')}],
  },`;

  // Find the MENU_ITEMS array and add the new item
  const menuItemsRegex = /(export const MENU_ITEMS: MenuItem\[\] = \[)([\s\S]*?)(\];)/;
  const match = content.match(menuItemsRegex);

  if (match) {
    const [fullMatch, before, items, after] = match;
    // Add new item before the closing bracket
    const updatedItems = items.trimEnd() + '\n' + newMenuItem + '\n';
    content = content.replace(fullMatch, before + updatedItems + after);

    // Note: We don't modify imports since we always use SettingsIcon which is already imported

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
        name: 'pathParent',
        message: 'Chemin après /dashboard/ (ex: super-admin, mentor, evaluator, author, editor):',
        validate: validatePathParent,
        filter: (input) => input.trim().toLowerCase().replace(/\//g, '/'),
      },
      {
        type: 'input',
        name: 'folderName',
        message: 'Nom du dossier/page (kebab-case, ex: laboratories, researchers):',
        validate: (input) => validateKebabCase(input, 'Le nom du dossier'),
        filter: (input) => toKebabCase(input.trim()),
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Nom d\'affichage (ex: Laboratoires):',
        validate: (input) => input.trim().length > 0 || 'Le nom d\'affichage est requis',
      },
      {
        type: 'checkbox',
        name: 'roles',
        message: 'Rôles autorisés (sélection multiple):',
        choices: ROLES,
        validate: (input) => input.length > 0 || 'Sélectionnez au moins un rôle',
      },
    ]);

    const { pathParent, folderName, displayName, roles } = answers;
    const iconName = 'Settings'; // For templates (page.tsx, card.tsx)
    const iconNameForRoles = 'SettingsIcon'; // For roles.ts (Settings as SettingsIcon)
    const featureNamePascal = toPascalCase(folderName);

    // Generate route automatically
    const route = `/dashboard/${pathParent}/${folderName}`;

    // Validate that path doesn't exist
    const pathValidation = validatePagePath(pathParent, folderName);
    if (pathValidation !== true) {
      console.error(`❌ ${pathValidation}`);
      process.exit(1);
    }

    console.log('\n📝 Création des fichiers...\n');

    // Base path for the new page: src/app/(dashboard)/dashboard/[pathParent]/[folderName]
    const basePath = path.join(process.cwd(), 'src', 'app', '(dashboard)', 'dashboard', pathParent, folderName);
    const displayPath = `dashboard/${pathParent}/${folderName}`;

    // Create directories
    ensureDir(basePath);
    ensureDir(path.join(basePath, 'checkers'));
    ensureDir(path.join(basePath, 'components'));
    ensureDir(path.join(basePath, 'fetchers'));
    ensureDir(path.join(basePath, 'helpers'));

    // Create files
    console.log(`  ✓ ${displayPath}/page.tsx`);
    writeFile(
      path.join(basePath, 'page.tsx'),
      getPageTemplate(folderName, featureNamePascal, iconName)
    );

    console.log(`  ✓ ${displayPath}/checkers/validators.ts`);
    writeFile(
      path.join(basePath, 'checkers', 'validators.ts'),
      getValidatorsTemplate(folderName, featureNamePascal)
    );

    console.log(`  ✓ ${displayPath}/fetchers/useFetch${featureNamePascal}.ts`);
    writeFile(
      path.join(basePath, 'fetchers', `useFetch${featureNamePascal}.ts`),
      getFetcherGetTemplate(folderName, featureNamePascal)
    );

    console.log(`  ✓ ${displayPath}/fetchers/useCreate${featureNamePascal}.ts`);
    writeFile(
      path.join(basePath, 'fetchers', `useCreate${featureNamePascal}.ts`),
      getFetcherCreateTemplate(folderName, featureNamePascal)
    );

    console.log(`  ✓ ${displayPath}/components/${featureNamePascal}Card.tsx`);
    writeFile(
      path.join(basePath, 'components', `${featureNamePascal}Card.tsx`),
      getCardTemplate(folderName, featureNamePascal, iconName)
    );

    console.log(`  ✓ ${displayPath}/helpers/formatters.ts`);
    writeFile(
      path.join(basePath, 'helpers', 'formatters.ts'),
      getFormattersTemplate(folderName, featureNamePascal)
    );

    // Update roles configuration
    console.log('\n🔧 Mise à jour de la configuration...\n');
    updateRolesConfig(folderName, displayName, iconNameForRoles, route, roles);

    console.log('\n✨ Page créée avec succès!\n');
    console.log('📂 Emplacement:', basePath);
    console.log('🔗 Route:', route);
    console.log('👥 Rôles autorisés:', roles.join(', '));
    console.log('\n💡 Prochaines étapes:');
    console.log('  1. Changer l\'icône SettingsIcon dans src/config/roles.ts');
    console.log('  2. Adapter les endpoints API dans les fetchers');
    console.log('  3. Personnaliser les champs dans validators.ts');
    console.log('  4. Ajuster le composant Card selon vos besoins');
    console.log('  5. Tester la page:', route);
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
