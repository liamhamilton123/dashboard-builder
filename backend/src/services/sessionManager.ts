export interface SessionMetadata {
  sessionId: string;
  workspacePath: string;
  createdAt: Date;
  lastActivityAt: Date;
}

class SessionManager {
  private sessions: Map<string, SessionMetadata> = new Map();

  /**
   * Create a new session
   */
  createSession(sessionId: string, workspacePath: string): SessionMetadata {
    const now = new Date();
    const metadata: SessionMetadata = {
      sessionId,
      workspacePath,
      createdAt: now,
      lastActivityAt: now,
    };

    this.sessions.set(sessionId, metadata);
    console.log(`[Session] Created session ${sessionId}`);

    return metadata;
  }

  /**
   * Get session metadata
   */
  getSession(sessionId: string): SessionMetadata | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Update session activity timestamp
   */
  updateActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      session.lastActivityAt = new Date();
    }
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    console.log(`[Session] Deleted session ${sessionId}`);
  }

  /**
   * Get all active sessions
   */
  getAllSessions(): SessionMetadata[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Clean up inactive sessions (no activity for N hours)
   */
  cleanupInactiveSessions(maxInactiveHours: number = 24): number {
    const now = new Date();
    const maxAge = maxInactiveHours * 60 * 60 * 1000;
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const inactiveTime = now.getTime() - session.lastActivityAt.getTime();

      if (inactiveTime > maxAge) {
        this.deleteSession(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[Session] Cleaned up ${cleanedCount} inactive sessions`);
    }

    return cleanedCount;
  }

  /**
   * Check if a session exists
   */
  hasSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }
}

// Singleton instance
export const sessionManager = new SessionManager();
