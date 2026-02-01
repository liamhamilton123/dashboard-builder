import path from 'path';

/**
 * Validate session ID format
 * Only allow alphanumeric characters, dashes, and underscores
 */
export function validateSessionId(sessionId: string): boolean {
  if (!sessionId || typeof sessionId !== 'string') {
    return false;
  }

  // Only allow alphanumeric, dash, and underscore (max 100 chars)
  const validPattern = /^[a-zA-Z0-9_-]{1,100}$/;
  return validPattern.test(sessionId);
}

/**
 * Validate file path to prevent directory traversal attacks
 * Ensures the resolved path stays within the workspace directory
 */
export function validateFilePath(filename: string, workspacePath: string): boolean {
  if (!filename || typeof filename !== 'string') {
    return false;
  }

  // Prevent absolute paths
  if (path.isAbsolute(filename)) {
    return false;
  }

  // Resolve the full path
  const resolvedPath = path.resolve(workspacePath, filename);

  // Ensure the resolved path is within the workspace
  if (!resolvedPath.startsWith(workspacePath)) {
    return false;
  }

  // Prevent certain dangerous characters
  if (filename.includes('\0') || filename.includes('..')) {
    return false;
  }

  return true;
}

/**
 * Sanitize filename to remove potentially dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path separators from the beginning
  let sanitized = filename.replace(/^[\/\\]+/, '');

  // Normalize path separators
  sanitized = sanitized.replace(/\\/g, '/');

  return sanitized;
}

/**
 * Check if a filename should be ignored (system files)
 */
export function shouldIgnoreFile(filename: string): boolean {
  const ignoredPatterns = [
    /^\.DS_Store$/,
    /^Thumbs\.db$/,
    /^desktop\.ini$/,
    /^\._/,  // macOS resource forks
    /^\.git/,
  ];

  const baseName = path.basename(filename);
  return ignoredPatterns.some(pattern => pattern.test(baseName));
}

/**
 * Validate message content
 */
export function validateMessage(message: string): boolean {
  if (!message || typeof message !== 'string') {
    return false;
  }

  // Max message length: 10,000 characters
  if (message.length > 10000) {
    return false;
  }

  return true;
}

/**
 * Validate files object structure
 */
export function validateFilesObject(files: unknown): files is Record<string, string> {
  if (!files || typeof files !== 'object' || Array.isArray(files)) {
    return false;
  }

  const fileRecord = files as Record<string, unknown>;

  // Check each entry
  for (const [filename, content] of Object.entries(fileRecord)) {
    // Filename must be a non-empty string
    if (!filename || typeof filename !== 'string') {
      return false;
    }

    // Content must be a string
    if (typeof content !== 'string') {
      return false;
    }

    // Max file size: 1MB
    if (content.length > 1024 * 1024) {
      return false;
    }
  }

  return true;
}
