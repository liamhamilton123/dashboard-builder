import fs from 'fs/promises';
import path from 'path';
import { validateFilePath, sanitizeFilename, shouldIgnoreFile } from './validators.js';

/**
 * Sync files from frontend to workspace
 * Writes all files to the workspace directory
 */
export async function syncFilesToWorkspace(
  workspacePath: string,
  files: Record<string, string>
): Promise<void> {
  try {
    for (const [filename, content] of Object.entries(files)) {
      // Sanitize and validate filename
      const sanitizedFilename = sanitizeFilename(filename);

      if (!validateFilePath(sanitizedFilename, workspacePath)) {
        console.warn(`[FileSync] Skipping invalid file path: ${filename}`);
        continue;
      }

      if (shouldIgnoreFile(sanitizedFilename)) {
        console.warn(`[FileSync] Skipping system file: ${filename}`);
        continue;
      }

      const filePath = path.join(workspacePath, sanitizedFilename);

      // Create directory if needed
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, content, 'utf-8');
    }

    console.log(`[FileSync] Synced ${Object.keys(files).length} files to workspace`);
  } catch (error) {
    console.error('[FileSync] Error syncing files to workspace:', error);
    throw new Error(`Failed to sync files: ${(error as Error).message}`);
  }
}

/**
 * Read all files from workspace
 * Returns a map of filename -> content
 */
export async function syncFilesFromWorkspace(
  workspacePath: string
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  try {
    await readDirectoryRecursive(workspacePath, workspacePath, files);
    console.log(`[FileSync] Read ${Object.keys(files).length} files from workspace`);
    return files;
  } catch (error) {
    console.error('[FileSync] Error reading files from workspace:', error);
    throw new Error(`Failed to read files: ${(error as Error).message}`);
  }
}

/**
 * Recursively read all files in a directory
 */
async function readDirectoryRecursive(
  dirPath: string,
  workspacePath: string,
  files: Record<string, string>
): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    // Skip system files
    if (shouldIgnoreFile(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      // Recursively read subdirectories
      await readDirectoryRecursive(fullPath, workspacePath, files);
    } else if (entry.isFile()) {
      // Read file content
      const content = await fs.readFile(fullPath, 'utf-8');

      // Store with relative path as key
      const relativePath = path.relative(workspacePath, fullPath);
      files[relativePath] = content;
    }
  }
}

/**
 * Check if workspace has any files
 */
export async function workspaceHasFiles(workspacePath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(workspacePath);
    return entries.length > 0;
  } catch {
    return false;
  }
}
