#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs, styleText } from 'node:util';
import inquirer from 'inquirer';

const TEMPLATES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'templates');

// Versions installed in generated projects — bump them here
const VERSIONS = {
  express: '^5.3.0',
  helmet: '^8.3.0',
  cors: '^2.8.6',
  morgan: '^1.12.1',
  'express-rate-limit': '^8.7.1',
  mongoose: '^9.11.2',
  bcryptjs: '^3.0.3',
  jsonwebtoken: '^9.0.3',
  'cookie-parser': '^1.4.7',
  supertest: '^7.3.1',
  typescript: '^7.0.2',
  tsx: '^4.23.15',
  '@types/node': '^22.0.0',
  '@types/express': '^5.0.6',
  '@types/cors': '^2.8.19',
  '@types/morgan': '^1.9.10',
  '@types/jsonwebtoken': '^9.0.10',
  '@types/cookie-parser': '^1.4.10',
  '@types/supertest': '^7.2.1',
};

const red = (s) => styleText('red', s);
const green = (s) => styleText('green', s);
const cyan = (s) => styleText('cyan', s);
const dim = (s) => styleText('dim', s);

function fail(message) {
  console.error(red(`\n✖ ${message}\n`));
  process.exit(1);
}

// ---------- 1. Read the command ----------

const { values: flags, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    yes: { type: 'boolean', short: 'y' },
    ts: { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
  },
});

if (flags.help || !positionals[0]) {
  console.log(`
Usage: npx instant-express <project-name> [options]

Options:
  -y, --yes   Skip questions, use defaults (JavaScript, MongoDB, auth, tests, git)
  --ts        Use TypeScript (with --yes)
  -h, --help  Show this help
`);
  process.exit(positionals[0] ? 0 : 1);
}

const projectName = positionals[0];
if (!/^[a-z0-9][a-z0-9_-]{0,49}$/.test(projectName)) {
  fail('Project name: lowercase letters, numbers, - and _ only (e.g. my-api)');
}

const targetDir = path.resolve(projectName);
if (fs.existsSync(targetDir)) fail(`Folder "${projectName}" already exists — pick another name.`);

// ---------- 2. Ask what to include ----------

const defaults = { language: flags.ts ? 'ts' : 'js', db: true, auth: true, extras: ['tests', 'git'], port: 5000, install: true };

console.log(styleText(['blue', 'bold'], '\n⚡ instant-express\n'));

const answers = flags.yes
  ? defaults
  : await inquirer.prompt([
      {
        type: 'select',
        name: 'language',
        message: 'Language:',
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' },
        ],
        default: defaults.language,
      },
      { type: 'confirm', name: 'db', message: 'Use MongoDB (Mongoose)?', default: true },
      {
        type: 'confirm',
        name: 'auth',
        message: 'Add authentication (signup, login, logout, me — JWT in httpOnly cookie)?',
        default: true,
        when: (a) => a.db, // users need a database
      },
      {
        type: 'checkbox',
        name: 'extras',
        message: 'Extras:',
        choices: [
          { name: 'Tests (node:test + supertest)', value: 'tests', checked: true },
          { name: 'Docker (Dockerfile + docker-compose)', value: 'docker' },
          { name: 'Initialize a git repository', value: 'git', checked: true },
        ],
      },
      {
        type: 'number',
        name: 'port',
        message: 'Port:',
        default: defaults.port,
        validate: (p) => (Number.isInteger(p) && p > 0 && p < 65536) || 'Enter a port between 1 and 65535',
      },
      { type: 'confirm', name: 'install', message: 'Install dependencies now?', default: true },
    ]);

const options = {
  ts: answers.language === 'ts',
  js: answers.language === 'js',
  db: answers.db,
  auth: Boolean(answers.auth),
  tests: answers.extras.includes('tests'),
  docker: answers.extras.includes('docker'),
};

// ---------- 3. Copy templates ----------

// Removes the lines between "@if name" and "@endif" when that option is off, then fills {{PLACEHOLDERS}}
function render(text, vars) {
  const kept = [];
  const skipping = [];
  for (const line of text.split('\n')) {
    const ifMatch = line.match(/^\s*(?:\/\/|#)\s*@if (\w+)\s*$/);
    if (ifMatch) skipping.push(!options[ifMatch[1]]);
    else if (/^\s*(?:\/\/|#)\s*@endif\s*$/.test(line)) skipping.pop();
    else if (!skipping.includes(true)) kept.push(line);
  }
  return kept.join('\n').replace(/{{(\w+)}}/g, (match, key) => vars[key] ?? match);
}

// npm drops dotfiles like .gitignore when publishing, so templates store them as _gitignore
function copyFolder(folder, vars) {
  const from = path.join(TEMPLATES, folder);
  for (const file of fs.readdirSync(from, { recursive: true })) {
    const source = path.join(from, file);
    if (fs.statSync(source).isDirectory()) continue;
    const target = path.join(targetDir, path.dirname(file), path.basename(file).replace(/^_/, '.'));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, render(fs.readFileSync(source, 'utf8'), vars));
  }
}

const vars = {
  PROJECT_NAME: projectName,
  PORT: String(answers.port),
  EXT: options.ts ? 'ts' : 'js',
  JWT_SECRET: crypto.randomBytes(32).toString('hex'),
};
const lang = options.ts ? 'ts' : 'js';

copyFolder('common', vars);
copyFolder(`${lang}/base`, vars);
if (options.db) copyFolder(`${lang}/db`, vars);
if (options.auth) copyFolder(`${lang}/auth`, vars);
if (options.tests) copyFolder(`${lang}/tests`, vars);
if (options.docker) copyFolder('docker', vars);

// .env gets a real random secret; .env.example (safe to commit) gets a placeholder
const envFile = path.join(targetDir, '.env');
fs.writeFileSync(
  path.join(targetDir, '.env.example'),
  fs.readFileSync(envFile, 'utf8').replace(vars.JWT_SECRET, 'replace_with_a_long_random_string'),
);

fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(createPackageJson(), null, 2) + '\n');

function createPackageJson() {
  const pick = (...names) => Object.fromEntries(names.map((n) => [n, VERSIONS[n]]));
  const deps = ['express', 'helmet', 'cors', 'morgan', 'express-rate-limit'];
  const devDeps = [];
  if (options.db) deps.push('mongoose');
  if (options.auth) deps.push('bcryptjs', 'jsonwebtoken', 'cookie-parser');
  if (options.tests) devDeps.push('supertest');
  if (options.ts) {
    devDeps.push('typescript', 'tsx', '@types/node', '@types/express', '@types/cors', '@types/morgan');
    if (options.auth) devDeps.push('@types/jsonwebtoken', '@types/cookie-parser');
    if (options.tests) devDeps.push('@types/supertest');
  }

  const scripts = options.ts
    ? { dev: 'tsx watch src/server.ts', build: 'tsc', start: 'node dist/server.js' }
    : { dev: 'node --watch src/server.js', start: 'node src/server.js' };
  if (options.tests) scripts.test = options.ts ? 'tsx --test tests/*.test.ts' : 'node --test tests/*.test.js';

  return {
    name: projectName,
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts,
    engines: { node: '>=22' },
    dependencies: pick(...deps),
    ...(devDeps.length && { devDependencies: pick(...devDeps) }),
  };
}

console.log(green(`✔ Created ${projectName}/ (${options.ts ? 'TypeScript' : 'JavaScript'})`));

// ---------- 4. Install + git ----------

// Use whichever package manager ran this command (npx → npm, pnpm dlx → pnpm, ...)
const pm = process.env.npm_config_user_agent?.split('/')[0] || 'npm';
const run = (command) => execSync(command, { cwd: targetDir, stdio: 'inherit' });

if (answers.install) {
  console.log(dim(`\nRunning ${pm} install...\n`));
  try {
    run(`${pm} install`);
  } catch {
    console.log(red(`\nInstall failed. Run it yourself: cd ${projectName} && ${pm} install`));
  }
}

if (answers.extras.includes('git')) {
  try {
    execSync('git init -q', { cwd: targetDir, stdio: 'ignore' });
    console.log(green('✔ Git repository initialized'));
  } catch {
    console.log(dim('Git not found — skipped git init'));
  }
}

// ---------- 5. Next steps ----------

console.log(`
${green('🎉 Done!')} Next steps:

  ${cyan(`cd ${projectName}`)}${answers.install ? '' : `\n  ${cyan(`${pm} install`)}`}
  ${cyan(`${pm} run dev`)}
${options.db ? dim('\nMongoDB must be running, or put your Atlas URL in .env (MONGO_URI).') : ''}
`);
