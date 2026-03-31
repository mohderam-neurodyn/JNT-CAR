#!/usr/bin/env node

// Simple deployment check script
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment readiness...\n');

// Check required files
const requiredFiles = [
  'lib/api.ts',
  'lib/data.ts', 
  'lib/utils.ts',
  'package.json',
  'next.config.js',
  'tsconfig.json',
  '.env.local'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check build output
const buildDir = '.next';
const buildExists = fs.existsSync(buildDir);

console.log(`\n📦 Build directory: ${buildExists ? '✅' : '❌'} ${buildDir}`);

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const hasBuildScript = packageJson.scripts && packageJson.scripts.build;

console.log(`📜 Build script: ${hasBuildScript ? '✅' : '❌'} npm run build`);

// Final status
console.log('\n🚀 Deployment Status:');
if (allFilesExist && buildExists && hasBuildScript) {
  console.log('✅ Ready for deployment!');
  console.log('\n📋 Next steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Ready for deployment"');
  console.log('3. git push origin main');
  console.log('4. Deploy to Vercel');
} else {
  console.log('❌ Issues found - please fix before deploying');
  process.exit(1);
}
