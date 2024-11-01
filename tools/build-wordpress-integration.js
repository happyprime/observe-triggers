// Import necessary modules using ES module syntax
import { promises as fs } from 'fs';
import path from 'path';
import archiver from 'archiver';
import { createReadStream, createWriteStream } from 'fs';

/**
 *
 */
async function getPluginVersion() {
	const pluginFile = await fs.readFile(
		'integrations/wordpress/plugin.php',
		'utf8'
	);
	const versionMatch = pluginFile.match(/Version:\s*(\d+\.\d+\.\d+)/i);
	if (!versionMatch) {
		throw new Error('Could not find version in plugin.php');
	}
	return versionMatch[1];
}

/**
 *
 * @param src
 * @param dest
 */
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

/**
 *
 * @param sourceDir
 * @param outputFile
 */
async function createZip(sourceDir, outputFile) {
	return new Promise((resolve, reject) => {
		const output = createWriteStream(outputFile);
		const archive = archiver('zip', {
			zlib: { level: 9 },
		});

		output.on('close', resolve);
		archive.on('error', reject);

		archive.pipe(output);
		// Specify the target directory name in the zip file
		archive.directory(sourceDir, 'observe-triggers-wp');
		archive.finalize();
	});
}

/**
 *
 */
async function buildPlugin() {
	try {
		const version = await getPluginVersion();
		const tempDir = 'observe-triggers-wp';
		const zipName = `observe-triggers-wp-${version}.zip`;

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
