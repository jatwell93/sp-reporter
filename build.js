#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get package.json info
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
const description = packageJson.description;
const pluginDir = 'date-range-reporter';
const zipFile = '../date-range-reporter.zip';

// Clean up previous build
console.log('Cleaning up previous build...');
try {
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
    if (fs.existsSync(path.join(pluginDir, 'manifest.json'))) fs.unlinkSync(path.join(pluginDir, 'manifest.json'));
    console.log('✓ Cleaned');
} catch (error) {
    console.error('Error cleaning up:', error.message);
    process.exit(1);
}

// Generate manifest.json from template
console.log('Generating manifest.json from template...');
try {
    const template = fs.readFileSync(path.join(pluginDir, 'manifest.json.template'), 'utf8');
    const manifest = template
        .replace(/{{VERSION}}/g, version)
        .replace(/{{DESCRIPTION}}/g, description);
    fs.writeFileSync(path.join(pluginDir, 'manifest.json'), manifest);
    console.log('✓ Manifest generated');
} catch (error) {
    console.error('Error generating manifest:', error.message);
    process.exit(1);
}

// Create zip file using simple PowerShell command
console.log('Building plugin zip file...');
try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Simple PowerShell command to create zip
    const command = `Compress-Archive -Path "${pluginDir}\\*" -DestinationPath "${zipFile}" -CompressionLevel Optimal`;

    execSync(`powershell -Command "${command}"`, {
        cwd: __dirname,
        stdio: 'inherit'
    });

    console.log(`✓ Plugin packaged successfully: ${zipFile}`);
    console.log('Build completed successfully!');
} catch (error) {
    console.error('Error creating zip:', error.message);
    process.exit(1);
}