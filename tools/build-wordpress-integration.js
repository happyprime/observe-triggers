const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { createReadStream, createWriteStream } = require('fs');

async function getPluginVersion() {
    const pluginFile = await fs.readFile('integrations/wordpress/plugin.php', 'utf8');
    const versionMatch = pluginFile.match(/Version:\s*(\d+\.\d+\.\d+)/i);
    if (!versionMatch) {
        throw new Error('Could not find version in plugin.php');
    }
    return versionMatch[1];
}

async function copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

async function createZip(sourceDir, outputFile) {
    return new Promise((resolve, reject) => {
        const output = createWriteStream(outputFile);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', resolve);
        archive.on('error', reject);

        archive.pipe(output);
        // Specify the target directory name in the zip file
        archive.directory(sourceDir, 'observe-triggers');
        archive.finalize();
    });
}

async function buildPlugin() {
    try {
        const version = await getPluginVersion();
        const tempDir = 'observe-triggers';
        const zipName = `observe-triggers-${version}.zip`;

        // Clean up any existing temp directory
        try {
            await fs.rm(tempDir, { recursive: true });
        } catch (e) {
            // Directory might not exist, that's fine
        }

        // Step 1: Copy WordPress plugin directory
        await copyDirectory('integrations/wordpress', tempDir);

		// Make sure the js directory exists
		await fs.mkdir(path.join(tempDir, 'js'), { recursive: true });

        // Step 2: Copy built JS
        await fs.copyFile(
            'build/index.js',
            path.join(tempDir, 'js/observe-triggers.js')
        );

        // Step 3: Create zip file
        await createZip(tempDir, zipName);

        // Step 4: Clean up
        await fs.rm(tempDir, { recursive: true });

        console.log(`Successfully created ${zipName}`);
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

buildPlugin();
