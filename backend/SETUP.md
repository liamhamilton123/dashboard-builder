# Backend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Add your Anthropic API key:**
   - Get an API key from https://console.anthropic.com/
   - Open `.env` and replace `your-api-key-here` with your actual API key:
     ```
     ANTHROPIC_API_KEY=sk-ant-api03-xxx...
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on http://localhost:2000

5. **Test the server:**
   ```bash
   curl http://localhost:2000/health
   ```

   You should see:
   ```json
   {"status":"ok","timestamp":"...","uptime":...}
   ```

## WebSocket Testing

You can test the WebSocket endpoint using the browser console:

```javascript
const ws = new WebSocket('ws://localhost:2000/ws/chat');

ws.onopen = () => {
  console.log('Connected!');

  // Initialize a session
  ws.send(JSON.stringify({
    type: 'init',
    sessionId: 'test-123',
    files: {
      'Dashboard.tsx': 'export default function Dashboard() { return <div>Hello</div>; }'
    }
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// After connection is initialized, send a message
setTimeout(() => {
  ws.send(JSON.stringify({
    type: 'message',
    sessionId: 'test-123',
    message: 'Add a title that says "My Dashboard"'
  }));
}, 1000);
```

## Production Deployment

For production:

1. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

3. **Set production environment:**
   ```bash
   NODE_ENV=production npm start
   ```

## Troubleshooting

**"Missing required environment variables: ANTHROPIC_API_KEY"**
- Make sure you've created a `.env` file
- Ensure your API key is correctly set in the `.env` file
- The API key should start with `sk-ant-`

**Port 2000 already in use:**
- Change the PORT in `.env` to another port (e.g., 3001)
- Or kill the process using port 2000:
  ```bash
  lsof -ti:2000 | xargs kill
  ```

**WebSocket connection refused:**
- Ensure the server is running
- Check that CORS_ORIGIN in `.env` matches your frontend URL
- Verify you're connecting to the correct WebSocket path: `/ws/chat`

## Architecture Overview

The backend consists of:

- **Express server** (src/server.ts) - HTTP server and middleware
- **WebSocket server** (src/websocket/) - Real-time communication
- **Claude integration** (src/services/claudeAgent.ts) - AI code generation
- **Workspace management** (src/services/workspaceManager.ts) - File system isolation
- **Session tracking** (src/services/sessionManager.ts) - User session management

Each user session gets its own isolated workspace in `/tmp/sessions/{sessionId}/`.
