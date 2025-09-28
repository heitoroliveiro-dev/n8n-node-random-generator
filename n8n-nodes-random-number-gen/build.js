#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building n8n node...');

try {
    // Step 1: Clean dist directory
    console.log('📁 Cleaning dist directory...');
    if (fs.existsSync('./dist')) {
        fs.rmSync('./dist', { recursive: true, force: true });
    }
    
    // Step 2: Compile TypeScript
    console.log('⚙️  Compiling TypeScript...');
    execSync('npx tsc', { stdio: 'inherit' });
    
    // Step 3: Copy assets
    console.log('📄 Copying assets...');
    const sourceIcon = path.join('./nodes/Random/random.svg');
    const destIcon = path.join('./dist/nodes/Random/random.svg');
    
    if (fs.existsSync(sourceIcon)) {
        fs.copyFileSync(sourceIcon, destIcon);
        console.log('✅ Icon copied successfully');
    } else {
        console.log('⚠️  Icon file not found, skipping...');
    }
    
    // Step 4: Validate build
    console.log('🔍 Validating build...');
    const requiredFiles = [
        './dist/nodes/Random/Random.node.js',
        './dist/nodes/Random/Random.node.d.ts',
        './dist/package.json'
    ];
    
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            throw new Error(`Required file missing: ${file}`);
        }
    }
    
    console.log('✅ Build completed successfully!');
    console.log('📦 Generated files:');
    console.log('   - dist/nodes/Random/Random.node.js');
    console.log('   - dist/nodes/Random/Random.node.d.ts');
    console.log('   - dist/nodes/Random/Random.node.js.map');
    console.log('   - dist/nodes/Random/random.svg');
    console.log('   - dist/package.json');
    
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}