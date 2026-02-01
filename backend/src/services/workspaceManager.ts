import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';

export interface WorkspaceInfo {
  sessionId: string;
  path: string;
  createdAt: Date;
}

class WorkspaceManager {
  private workspaces: Map<string, WorkspaceInfo> = new Map();

  /**
   * Get the full path for a session's workspace
   */
  getWorkspacePath(sessionId: string): string {
    return path.join(env.workspaceBasePath, sessionId);
  }

  /**
   * Create a new workspace for a session
   */
  async createWorkspace(sessionId: string): Promise<string> {
    const workspacePath = this.getWorkspacePath(sessionId);

    try {
      // Create workspace directory
      await fs.mkdir(workspacePath, { recursive: true });

      // Track workspace
      this.workspaces.set(sessionId, {
        sessionId,
        path: workspacePath,
        createdAt: new Date(),
      });

      console.log(`[Workspace] Created workspace for session ${sessionId}`);
      return workspacePath;
    } catch (error) {
      console.error(`[Workspace] Failed to create workspace for ${sessionId}:`, error);
      throw new Error(`Failed to create workspace: ${(error as Error).message}`);
    }
  }

  /**
   * Get existing workspace or create a new one
   */
  async getOrCreateWorkspace(sessionId: string): Promise<string> {
    const existing = this.workspaces.get(sessionId);

    if (existing) {
      // Verify workspace still exists on disk
      try {
        await fs.access(existing.path);
        return existing.path;
      } catch {
        // Workspace was deleted, remove from map and recreate
        this.workspaces.delete(sessionId);
      }
    }

    return await this.createWorkspace(sessionId);
  }

  /**
   * Delete a workspace
   */
  async deleteWorkspace(sessionId: string): Promise<void> {
    const workspace = this.workspaces.get(sessionId);

    if (!workspace) {
      return;
    }

    try {
      await fs.rm(workspace.path, { recursive: true, force: true });
      this.workspaces.delete(sessionId);
      console.log(`[Workspace] Deleted workspace for session ${sessionId}`);
    } catch (error) {
      console.error(`[Workspace] Failed to delete workspace for ${sessionId}:`, error);
      throw new Error(`Failed to delete workspace: ${(error as Error).message}`);
    }
  }

  /**
   * Get workspace info if it exists
   */
  getWorkspace(sessionId: string): WorkspaceInfo | undefined {
    return this.workspaces.get(sessionId);
  }

  /**
   * List all active workspaces
   */
  getAllWorkspaces(): WorkspaceInfo[] {
    return Array.from(this.workspaces.values());
  }

  /**
   * Clean up old workspaces (older than 24 hours)
   */
  async cleanupOldWorkspaces(maxAgeHours: number = 24): Promise<number> {
    const now = new Date();
    const maxAge = maxAgeHours * 60 * 60 * 1000;
    let cleanedCount = 0;

    for (const [sessionId, workspace] of this.workspaces.entries()) {
      const age = now.getTime() - workspace.createdAt.getTime();

      if (age > maxAge) {
        try {
          await this.deleteWorkspace(sessionId);
          cleanedCount++;
        } catch (error) {
          console.error(`[Workspace] Failed to cleanup workspace ${sessionId}:`, error);
        }
      }
    }

    if (cleanedCount > 0) {
      console.log(`[Workspace] Cleaned up ${cleanedCount} old workspaces`);
    }

    return cleanedCount;
  }
}

// Singleton instance
export const workspaceManager = new WorkspaceManager();
