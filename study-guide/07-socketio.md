# Socket.io — Complete Exam Study Guide

> Target: 100% on the Web Programming II final exam. Every concept here has been sourced from the glossary, practice exams, and the actual course code (avatorium + signup-sheet demos).

---

## Table of Contents

1. [Why Real-Time? HTTP Problems](#1-why-real-time-http-problems)
2. [Transport Comparison: Polling vs SSE vs WebSocket vs Socket.io](#2-transport-comparison)
3. [Socket.io Basics](#3-socketio-basics)
4. [Emit Methods — The Big Three](#4-emit-methods--the-big-three)
5. [Rooms](#5-rooms)
6. [Namespaces](#6-namespaces)
7. [Middleware (Auth)](#7-middleware-auth)
8. [Disconnect Handling](#8-disconnect-handling)
9. [Acknowledgements](#9-acknowledgements)
10. [Session Management](#10-session-management)
11. [Integration with Express / Next.js](#11-integration-with-express--nextjs)
12. [Security (CORS, Auth)](#12-security-cors-auth)
13. [Reconnection Handling](#13-reconnection-handling)
14. [Full Chat App Pattern](#14-full-chat-app-pattern)
15. [Likely Exam Questions & Model Answers](#15-likely-exam-questions--model-answers)
16. [Cheat Sheet](#16-cheat-sheet)

---

## 1. Why Real-Time? HTTP Problems

### The Problem with Plain HTTP

Standard HTTP is **request-response**: the client sends a request, the server responds, the connection closes. This model is fundamentally incompatible with real-time use cases because:

- The server cannot **push** data to the client unprompted.
- Each request requires a full HTTP handshake (expensive).
- The client must constantly ask "has anything changed?" — called **polling**.

### Long Polling (the old workaround)

The client sends a request. The server **holds the connection open** until it has data to send (or a timeout). Then the client immediately opens a new long-poll request.

```
Client → GET /updates  (held open by server)
Server → 200 { data }  (finally responds when event happens)
Client → GET /updates  (opens new request immediately)
```

Problems: high server memory usage (each open connection consumes a thread/descriptor), high latency on timeout, not truly bidirectional.

### WebSocket — The Real Solution

WebSocket is a standardized protocol (RFC 6455) that **upgrades** an HTTP/1.1 connection to a persistent, full-duplex channel:

```
Client → HTTP GET /ws  Upgrade: websocket
Server → 101 Switching Protocols
=== persistent two-way channel from here ===
Server → push data at any time
Client → push data at any time
```

Key properties:
- **Full-duplex**: both sides send simultaneously without waiting.
- **Persistent**: one connection, many messages.
- **Low overhead**: no HTTP headers on each message after handshake.
- **Event-driven**: both sides react to events, not polling.

---

## 2. Transport Comparison

| Feature | HTTP Polling | HTTP Long Polling | SSE | WebSocket | Socket.io |
|---------|-------------|-------------------|-----|-----------|-----------|
| Direction | Client → Server | Client → Server | Server → Client only | Bidirectional | Bidirectional |
| Connection | New per request | Held open | Persistent, one-way | Persistent, two-way | Persistent, two-way |
| Overhead | High (headers each time) | Medium | Low | Very low | Low |
| Server push | No | Simulated | Yes (one-way) | Yes | Yes |
| Auto-reconnect | No | Manual | Built-in | No | Built-in |
| Rooms/namespaces | No | No | No | No | Yes |
| Fallback | — | — | — | No | Yes (falls back to long-polling) |
| Use case | Simple REST | Legacy real-time | News feeds, notifications | Custom real-time | Real-time apps (chat, games, live data) |

**SSE (Server-Sent Events)**: The server streams events to the client over a persistent HTTP connection. Client cannot send events back through the same channel. Good for one-way feeds (stock tickers, live logs).

**Socket.io vs raw WebSocket**:
- Socket.io is a **library** built on top of WebSocket (plus fallbacks).
- Socket.io adds: automatic reconnection, rooms, namespaces, middleware, event-based API, fallback to HTTP long-polling when WebSocket is blocked.
- Raw WebSocket has none of these extras.

**Exam trap**: Socket.io and WebSocket are NOT the same thing. Socket.io USES WebSocket as its primary transport.

---

## 3. Socket.io Basics

### Server Setup (with Express)

```javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);  // wrap Express in HTTP server

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',  // allowed client origin
    credentials: true
  }
});

// The connection event fires for every new client
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Listen for events from this specific client
  socket.on('message', (data) => {
    console.log('Received:', data);
  });

  // Fires when this client disconnects
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(4567);
```

Key points:
- You create a `Server` (`io`) that wraps an HTTP server — NOT Express directly.
- `io.on('connection', callback)` fires once per connected client.
- Each connection gets a unique `socket.id`.
- Each `socket` represents one client's connection.

### Client Setup (Vanilla JS / React)

```javascript
import { io } from 'socket.io-client';

// Connect to the server — returns a socket instance
const socket = io('http://localhost:4567');

// Listen for events from the server
socket.on('message', (data) => {
  console.log('Server says:', data);
});

// Send an event to the server
socket.emit('message', { text: 'Hello!' });

// Connection/disconnection events
socket.on('connect', () => console.log('Connected!', socket.id));
socket.on('disconnect', () => console.log('Disconnected'));
```

### Client Setup as a React Service (course pattern)

```javascript
// src/services/socketService.js
import { io } from 'socket.io-client';

const URL = 'http://localhost:4567';
export default io(URL);  // singleton — same socket everywhere
```

Then in a component:
```javascript
import socket from '../../services/socketService';

// Send
socket.emit('usersignup', eventId, user);

// Receive (in useEffect)
useEffect(() => {
  socket.on('usersignup', (eventId, user) => {
    // update local state
  });
  return () => socket.off('usersignup');  // cleanup!
}, []);
```

### The `connect` / `disconnect` lifecycle

```
Client                          Server
  |                               |
  |--- TCP + HTTP Upgrade ------->|
  |<-- 101 Switching Protocols ---|
  |                               |
  |    (connection established)   |
  |                               | io.on('connection') fires
  |<-- socket.emit('session') ----|
  |                               |
  |--- socket.emit('message') --->|  socket.on('message') fires
  |                               |
  |    (client closes tab)        |
  |                               | socket.on('disconnect') fires
```

---

## 4. Emit Methods — The Big Three

This is the most exam-critical section. Know each one cold.

### `io.emit(event, data)` — Send to EVERYONE

```javascript
io.on('connection', (socket) => {
  socket.on('chat:message', (msg) => {
    // Sends to ALL connected clients, INCLUDING the sender
    io.emit('chat:message', msg);
  });
});
```

**Chat example**: Server sends a system announcement ("Server maintenance in 5 min") to every connected user.

### `socket.emit(event, data)` — Send ONLY to sender

**Server side**: Sends back to the specific client whose socket this is.
```javascript
io.on('connection', (socket) => {
  // Sends session details back only to the connecting client
  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID
  });
});
```

**Client side**: Sends to the server.
```javascript
socket.emit('message', { text: 'Hello server!' });
```

**Chat example (server)**: Send a "Message delivered" receipt only to the sender.

### `socket.broadcast.emit(event, data)` — Send to EVERYONE EXCEPT sender

```javascript
io.on('connection', (socket) => {
  // Notify everyone else that a new user joined
  socket.broadcast.emit('user:joined', {
    userID: socket.userID,
    avatar: socket.avatar
  });

  socket.on('chat:message', (msg) => {
    // Send the message to everyone except the sender
    // (sender already sees their own message locally)
    socket.broadcast.emit('chat:message', msg);
  });
});
```

**Chat example**: When user A sends a message, everyone else gets it. User A doesn't need an echo because they already display it locally.

### Summary Table

| Method | Who receives it | Includes sender? |
|--------|----------------|-----------------|
| `io.emit(event, data)` | ALL clients | YES |
| `socket.emit(event, data)` | ONLY the sender (server-side) | Only sender |
| `socket.broadcast.emit(event, data)` | ALL clients EXCEPT sender | NO |
| `io.to(room).emit(event, data)` | All sockets in a specific room | Depends on if sender is in room |
| `socket.to(room).emit(event, data)` | All sockets in room EXCEPT sender | NO |

---

## 5. Rooms

Rooms are virtual groups of sockets. They allow you to send events to a specific subset of connected clients.

### Joining and Leaving

```javascript
io.on('connection', (socket) => {
  // Join a room
  socket.join('room:general');       // joins the named room
  socket.join(socket.userID);        // user's own private room (course pattern)

  // Leave a room
  socket.leave('room:general');

  // Send to everyone in a room (including sender if in that room)
  io.to('room:general').emit('message', 'Hello room!');

  // Send to everyone in a room EXCEPT sender
  socket.to('room:general').emit('message', 'New user joined!');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user:joined', socket.userID);
  });

  socket.on('sendMessage', (data) => {
    // Only people in data.roomId get this
    io.to(data.roomId).emit('newMessage', {
      from: socket.userId,
      text: data.text,
      timestamp: Date.now()
    });
  });
});
```

### Key Room Facts

- Sockets can be in multiple rooms simultaneously.
- Every socket is automatically in its own room named by `socket.id`.
- Rooms exist only on the server — the client doesn't need to know about room internals.
- When a socket disconnects, it automatically leaves all its rooms.

### Chat App Room Pattern (exam-ready)

```javascript
io.on('connection', (socket) => {
  // Each user joins their own private room for DMs
  socket.join(`user:${socket.userId}`);

  socket.on('joinChannel', (channelId) => {
    socket.join(`channel:${channelId}`);
    socket.to(`channel:${channelId}`).emit('user:joined', {
      userId: socket.userId,
      channelId
    });
  });

  socket.on('sendMessage', ({ channelId, text }) => {
    io.to(`channel:${channelId}`).emit('newMessage', {
      from: socket.userId,
      text,
      timestamp: Date.now()
    });
  });
});
```

---

## 6. Namespaces

Namespaces are separate communication channels on the **same underlying connection**. Think of them as separate "apps" on the same Socket.io server.

```javascript
// Default namespace: '/'
io.on('connection', socket => { ... });

// Custom namespace
const chatNS = io.of('/chat');
chatNS.on('connection', socket => {
  socket.on('message', (msg) => {
    chatNS.emit('message', msg); // only to /chat namespace
  });
});

const adminNS = io.of('/admin');
adminNS.on('connection', socket => {
  // Admin-only events
});
```

Client connecting to a namespace:
```javascript
const chatSocket = io('http://localhost:4567/chat');
const adminSocket = io('http://localhost:4567/admin');
```

**Namespace vs Room**:
- Namespace: defined on the server, clients choose which namespace to connect to. Separate event stream.
- Room: server-side grouping of sockets within a namespace. Clients don't "connect" to rooms — they are joined by the server.

---

## 7. Middleware (Auth)

Middleware runs before a connection is established. This is where you validate the client.

```javascript
// From the avatorium course demo
io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;

  if (sessionID) {
    // Returning user — restore session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.avatar = session.avatar;
      return next();  // allow connection
    }
  }

  const avatar = socket.handshake.auth.avatar;
  if (!avatar) {
    return next(new Error('invalid avatar'));  // REJECT connection
  }

  // New user — create session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.avatar = avatar;
  next();  // allow connection
});
```

### Token-based Auth Pattern (exam pattern from practice-exam-3)

```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (isValidToken(token)) {
    socket.userId = getUserId(token);
    next();              // allow the connection
  } else {
    next(new Error('Authentication failed'));  // reject
  }
});
```

### How the client sends auth data

```javascript
// Client passes auth data in the handshake
const socket = io('http://localhost:4567', {
  auth: {
    token: 'jwt_token_here',
    sessionID: localStorage.getItem('sessionID')
  }
});
```

### What happens on rejection

When middleware calls `next(new Error(...))`:
- The connection is refused.
- The client receives a `connect_error` event.
- The `connection` event on the server does NOT fire.

```javascript
// Client handles auth failure
socket.on('connect_error', (err) => {
  console.error('Connection refused:', err.message);
});
```

---

## 8. Disconnect Handling

```javascript
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);

    // Update session store (from avatorium)
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      avatar: socket.avatar,
      connected: false  // mark as offline, don't delete
    });

    // Notify other users
    socket.broadcast.emit('disconnected_user', socket.userID);
  });

  // Explicit "leave" action (user clicks logout)
  socket.on('leave', () => {
    sessionStore.removeSession(socket.sessionID);
    socket.broadcast.emit('user_left', socket.userID);
  });
});
```

**Important distinction**:
- `disconnect` fires automatically when the connection drops (browser closed, network loss).
- A custom `leave` event can be emitted by the client when they explicitly log out.

---

## 9. Acknowledgements

Acknowledgements let the sender know the receiver got the event — like a callback confirmation.

```javascript
// Server with acknowledgement
socket.on('sendMessage', (data, callback) => {
  // Process the message
  saveMessage(data);

  // Call the callback to acknowledge receipt
  callback({ status: 'ok', messageId: 123 });
});

// Client — receives the acknowledgement
socket.emit('sendMessage', { text: 'Hello' }, (response) => {
  console.log('Server acknowledged:', response.status); // 'ok'
  console.log('Message ID:', response.messageId);       // 123
});
```

**Why use acknowledgements?**
- Guarantee that a specific client received an event.
- Get a response back from the server without opening a separate request.
- Useful for form submissions over sockets where you need confirmation.

---

## 10. Session Management

Session management tracks connected users across reconnections. Without it, each reconnect creates a new socket with a new ID, losing user identity.

### Pattern from the Avatorium Course Demo

```javascript
// Server: middleware assigns/restores session
io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;  // restore existing session
      socket.userID = session.userID;
      socket.avatar = session.avatar;
      return next();
    }
  }
  // New session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.avatar = socket.handshake.auth.avatar;
  next();
});

io.on('connection', (socket) => {
  // Save/update session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    avatar: socket.avatar,
    connected: true
  });

  // Send session info back to the client
  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID,
    avatar: socket.avatar
  });

  // Each user joins their own private room (for targeted messages)
  socket.join(socket.userID);
});
```

### Client stores the session

```javascript
socket.on('session', ({ sessionID, userID, avatar }) => {
  // Store for future reconnections
  socket.auth = { sessionID };
  localStorage.setItem('sessionID', sessionID);
  // Save userID to Redux/Zustand store
  dispatch(addSession({ sessionID, userID, avatar }));
});
```

---

## 11. Integration with Express / Next.js

### Express Integration (standard pattern)

```javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);  // Socket.io needs the http.Server, not Express directly
const io = new Server(httpServer, { cors: { origin: '*' } });

// Express routes work normally
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Socket.io is separate
io.on('connection', (socket) => { ... });

httpServer.listen(4567);
```

**Common mistake**: Passing the Express `app` directly to `new Server()` — it must be the HTTP server.

### Next.js Integration

Socket.io does not integrate directly with Next.js API Routes because Next.js doesn't expose the underlying HTTP server easily. Common approaches:

**Option 1: Separate Node.js server** (recommended for production)
Run Socket.io on a separate port (e.g., 4567). The Next.js client connects to it directly.

```javascript
// Client component in Next.js
'use client';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4567');  // separate server

export default function ChatComponent() {
  useEffect(() => {
    socket.on('message', (data) => {
      // handle message
    });
    return () => {
      socket.off('message');
    };
  }, []);

  return <div>Chat</div>;
}
```

**Option 2: Custom server** (pages router only)
Use a custom `server.js` that wraps Next.js with Node.js http server.

**Note**: Socket.io requires a persistent server — it cannot run inside serverless functions (Vercel Edge/Lambda) because connections need to persist. In serverless environments, use a dedicated Socket.io server or a managed service like Ably or Pusher.

---

## 12. Security (CORS, Auth)

### CORS Configuration

**Server-side CORS (required when client and server are on different ports/origins)**:

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',  // exact origin(s) allowed
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true  // required if using cookies/session auth
  }
});
```

**Never use `origin: '*'` with `credentials: true`** — browsers block this. Use specific origins in production.

### Authentication Middleware Security

```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  // ALWAYS validate on the server — never trust the client
  if (!token) return next(new Error('No token provided'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Invalid token'));  // rejects the connection
  }
});
```

### Key Security Concerns

1. **Always authenticate in middleware** — don't let unauthenticated sockets connect.
2. **Validate data on the server** — socket events are like API calls; validate all incoming data.
3. **Rate limiting** — prevent spam by limiting how fast a client can emit events.
4. **Avoid trusting socket.id** as a user identifier — it changes on reconnect. Use your own session/user ID.
5. **CORS in production** — whitelist specific origins, never `*` with credentials.

---

## 13. Reconnection Handling

Socket.io has **automatic reconnection** built in on the client. After a connection drop, the client will attempt to reconnect using exponential backoff.

### Default behavior

```javascript
const socket = io('http://localhost:4567');
// Socket.io will auto-reconnect — no configuration needed
```

### Configuring reconnection

```javascript
const socket = io('http://localhost:4567', {
  reconnection: true,           // default: true
  reconnectionAttempts: 5,      // max retries before giving up
  reconnectionDelay: 1000,      // initial delay (ms)
  reconnectionDelayMax: 5000,   // max delay between retries
  randomizationFactor: 0.5,     // randomize delay to avoid thundering herd
  auth: {
    sessionID: localStorage.getItem('sessionID')  // restore session on reconnect
  }
});

socket.on('connect', () => {
  console.log('Connected / Reconnected:', socket.id);
});

socket.on('reconnect', (attempt) => {
  console.log('Reconnected after', attempt, 'attempts');
});

socket.on('reconnect_failed', () => {
  console.error('Could not reconnect after max attempts');
});
```

### Handling reconnection in React

```javascript
useEffect(() => {
  socket.on('connect', () => setConnected(true));
  socket.on('disconnect', () => setConnected(false));
  socket.on('reconnect', () => {
    // Re-join rooms, re-fetch state if needed
    socket.emit('users');
  });

  return () => {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('reconnect');
  };
}, []);
```

---

## 14. Full Chat App Pattern

Complete, exam-ready implementation covering all concepts.

### Server (`server/index.js`)

```javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = user.id;
    socket.username = user.name;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// ─── CONNECTION ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`User ${socket.username} connected: ${socket.id}`);

  // Join the user's private room
  socket.join(`user:${socket.userId}`);

  // Notify OTHERS that user joined (not the sender)
  socket.broadcast.emit('user:online', {
    userId: socket.userId,
    username: socket.username
  });

  // ─── ROOM MANAGEMENT ─────────────────────────────────────────────────────────
  socket.on('room:join', (roomId) => {
    socket.join(roomId);
    // Notify others in the room
    socket.to(roomId).emit('room:user_joined', {
      userId: socket.userId,
      username: socket.username,
      roomId
    });
    console.log(`${socket.username} joined room ${roomId}`);
  });

  socket.on('room:leave', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('room:user_left', {
      userId: socket.userId,
      roomId
    });
  });

  // ─── MESSAGING ───────────────────────────────────────────────────────────────
  socket.on('message:send', ({ roomId, text }, callback) => {
    // Validate
    if (!text || text.trim().length === 0) {
      return callback({ error: 'Message cannot be empty' });
    }

    const message = {
      id: crypto.randomUUID(),
      from: socket.userId,
      username: socket.username,
      text: text.trim(),
      timestamp: Date.now()
    };

    // Send to ALL in room (including sender)
    io.to(roomId).emit('message:new', message);

    // Acknowledge to sender
    callback({ status: 'ok', messageId: message.id });
  });

  // ─── DISCONNECT ───────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);

    // Notify others
    socket.broadcast.emit('user:offline', {
      userId: socket.userId,
      username: socket.username
    });
  });
});

httpServer.listen(4567, () => console.log('Socket.io server on :4567'));
```

### Client Service (`src/services/socketService.ts`)

```typescript
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:4567', {
      auth: {
        token: localStorage.getItem('jwt_token')
      },
      reconnection: true,
      reconnectionAttempts: 5
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
```

### React Chat Component (`src/components/Chat.tsx`)

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socketService';

interface Message {
  id: string;
  from: string;
  username: string;
  text: string;
  timestamp: number;
}

export default function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    // Join the room
    socket.emit('room:join', roomId);

    // Listen for new messages
    socket.on('message:new', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Track connection state
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Cleanup on unmount
    return () => {
      socket.emit('room:leave', roomId);
      socket.off('message:new');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [roomId]);  // re-run if roomId changes

  const sendMessage = () => {
    if (!input.trim()) return;

    // Send with acknowledgement
    socket.emit('message:send', { roomId, text: input }, (response) => {
      if (response.error) {
        console.error('Send failed:', response.error);
      }
      // Response.status === 'ok' means server received it
    });

    setInput('');
  };

  return (
    <div>
      <div style={{ color: connected ? 'green' : 'red' }}>
        {connected ? 'Connected' : 'Disconnected'}
      </div>

      <ul>
        {messages.map(msg => (
          <li key={msg.id}>
            <strong>{msg.username}</strong>: {msg.text}
          </li>
        ))}
      </ul>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

---

## 15. Likely Exam Questions & Model Answers

### Fill-in-the-Blanks (from practice-exam-3, Q9)

**Question**: Socket.io enables 1. ________, bidirectional communication between client and server. To send an event from the server to ALL connected clients, you use 2. ________. To send an event to all clients EXCEPT the sender, you use 3. ________. To listen for events, both client and server use the 4. ________ method. Socket.io 5. ________ are functions that run before a connection is established, often used for authentication.

**Answers**:
1. `real-time`
2. `io.emit()`
3. `socket.broadcast.emit()`
4. `.on()` (or `socket.on()`)
5. `middleware`

---

### Select All That Apply (from practice-exam-3, Q10)

**Which are true about Socket.io?**

- [x] Socket.io uses WebSockets as its primary transport but can fall back to HTTP long-polling
- [ ] Socket.io and raw WebSockets are the same thing — **FALSE** (Socket.io adds rooms, reconnect, etc.)
- [x] Socket.io supports automatic reconnection when the connection drops
- [x] Socket.io rooms allow you to group sockets and send events to specific groups
- [ ] `socket.emit()` sends an event to ALL connected clients — **FALSE** (sends only to that specific socket)
- [x] Socket.io middleware can be used to authenticate connections before they complete

---

### Written Answer — The Three Emit Methods (practice-exam-3, Q11)

**Question**: Explain the difference between `io.emit()`, `socket.emit()`, and `socket.broadcast.emit()`. Give a chat app example for each.

**Model Answer**:

- **`io.emit('message', data)`** — sends to ALL connected clients, including the sender. Use for: system-wide announcements. *Chat example: Server broadcasts "Maintenance in 10 minutes" to every user.*

- **`socket.emit('message', data)`** (server-side) — sends only to the specific client this socket represents. Use for: private responses to the connecting client. *Chat example: After a user connects, send them their session info and message history — only they need it.*

- **`socket.broadcast.emit('message', data)`** — sends to ALL clients EXCEPT the sender. Use for: telling others about an event the sender caused. *Chat example: When user A sends a message, all other users receive it. User A already sees their own message locally.*

---

### Code Analysis (practice-exam-3, Q12)

**Question**: Explain `io.use()` middleware and `socket.join()` / `io.to()`.

**Model Answer**:

a) `io.use()` intercepts every new connection BEFORE it completes. It validates the auth token from `socket.handshake.auth.token`. If valid, it attaches `userId` to `socket` and calls `next()` to allow the connection. If invalid, it calls `next(new Error('...'))` which rejects the connection — the client receives a `connect_error` event and the `connection` handler never fires.

b) `socket.join('user:${socket.userId}')` adds this socket to a named room. Rooms are virtual server-side groups of sockets. `io.to(data.roomId).emit(...)` sends an event to ALL sockets currently in that specific room. In a chat app, this means you can have channels (room:general, room:support) — only people who joined that room receive the message, not the entire server.

---

### Essay: Real-Time Stock Prices Scenario

**Question**: You need to display real-time stock prices that update every second to all connected users. What technology would you use and why?

**Model Answer**: Use Socket.io. Real-time stock prices require the server to push updates to clients without the client polling. Socket.io provides a persistent WebSocket connection, allowing the server to broadcast price updates to all connected clients using `io.emit('price:update', priceData)`. HTTP polling would be wasteful — thousands of clients polling every second creates enormous server load. SSE could work for one-way price feeds but Socket.io is preferred because: (1) it handles reconnection automatically, (2) it can support subscriptions (clients joining rooms for specific stocks), (3) it falls back to long-polling if WebSocket is blocked. The server would have a price update loop that calls `io.emit('price:update', prices)` every second.

---

### Essay: Chat App Architecture

**Question**: Design a real-time chat application with Socket.io. Describe: server setup, authentication, rooms, the three emit methods, disconnect handling.

**Model Answer** (hit all these points):

1. **Server setup**: Create an HTTP server wrapping Express, pass to `new Server(httpServer, { cors })`. This is required because Socket.io needs the raw HTTP server.

2. **Authentication**: Use `io.use()` middleware. Extract JWT from `socket.handshake.auth.token`, verify it with `jwt.verify()`. If valid, attach user info to socket and call `next()`. If invalid, call `next(new Error('...'))` — this rejects the connection before the `connection` event fires.

3. **Rooms**: On connection, user joins `socket.join('user:' + userId)` for private messages, and `socket.join('channel:' + channelId)` for channels. Messages are sent with `io.to(channelId).emit(...)`.

4. **Emit methods**: `io.emit()` for server-wide broadcasts (system notices). `socket.emit()` to send session data back only to the connecting client. `socket.broadcast.emit()` to notify other users when someone joins.

5. **Disconnect**: `socket.on('disconnect')` marks user offline in the session store, uses `socket.broadcast.emit('user:offline', userId)` to notify others. Session is preserved (not deleted) so the user can reconnect.

---

## 16. Cheat Sheet

### Emit Methods (memorize this)

```
io.emit()                → EVERYONE (including sender)
socket.emit()            → ONLY the sender (server-side) / server (client-side)
socket.broadcast.emit()  → EVERYONE EXCEPT the sender
io.to(room).emit()       → ALL sockets in a room (including sender if in room)
socket.to(room).emit()   → All sockets in room EXCEPT sender
```

### Core API Reference

```javascript
// SERVER
const io = new Server(httpServer, { cors: { origin: '...' } });
io.use((socket, next) => { /* middleware */ next() /* or next(new Error()) */ });
io.on('connection', (socket) => { /* each new client */ });

socket.id              // unique connection ID
socket.handshake.auth  // auth data sent by client
socket.join(room)      // add socket to room
socket.leave(room)     // remove socket from room

io.emit(event, data)               // to ALL
socket.emit(event, data)           // to THIS client
socket.broadcast.emit(event, data) // to ALL EXCEPT this client
io.to(room).emit(event, data)      // to room (includes sender)
socket.to(room).emit(event, data)  // to room (excludes sender)

// CLIENT
const socket = io('http://server:port', { auth: { token } });
socket.emit(event, data)           // to server
socket.on(event, callback)         // listen for server events
socket.off(event)                  // stop listening (cleanup!)
socket.disconnect()                // close connection
```

### Key Facts for Exam

| Fact | Answer |
|------|--------|
| Socket.io primary transport | WebSocket (falls back to HTTP long-polling) |
| Difference from raw WebSocket | Socket.io adds: rooms, namespaces, auto-reconnect, middleware, fallback |
| What `io.use()` does | Runs before connection, used for auth. Call `next()` to allow, `next(Error)` to reject |
| What fires when client disconnects | `socket.on('disconnect')` on the server |
| How to send to specific group | `socket.join(room)` then `io.to(room).emit()` |
| `socket.emit()` server-side sends to | Only the one connected client |
| `socket.broadcast.emit()` sends to | Everyone EXCEPT the sender |
| `io.emit()` sends to | All connected clients |
| Client auth data location | `socket.handshake.auth` |
| Socket.io in Next.js (serverless) | Cannot run in serverless — needs persistent server |
| Cleanup pattern in React | `socket.off(event)` in useEffect return |

### Transport Comparison (exam table)

| | Polling | Long Polling | SSE | WebSocket | Socket.io |
|--|---------|-------------|-----|-----------|-----------|
| Bidirectional | No | No | No (server→client only) | Yes | Yes |
| Auto-reconnect | No | No | Yes | No | Yes |
| Rooms | No | No | No | No | Yes |
| Fallback | — | — | — | No | Yes |

### Common Exam Traps

1. **`socket.emit()` on the SERVER sends ONLY to that client** — NOT to everyone. To send to everyone, use `io.emit()`.
2. **Socket.io != WebSocket** — Socket.io is a library that uses WebSocket. They are NOT the same thing.
3. **Middleware calls `next()` to allow, `next(new Error())` to reject** — not `return false` or throwing.
4. **Cleanup `socket.off()` in React useEffect** — forgetting to remove listeners causes memory leaks and duplicate handlers.
5. **Socket.io cannot run in serverless functions** — needs a persistent Node.js server.
6. **`io.to(room).emit()` includes the sender if they are in that room** — use `socket.to(room).emit()` to exclude them.
7. **CORS must be configured on BOTH Express and the Socket.io Server** — they are separate.

---

*Sources: glossary.md section G, practice-exam-3 (Q9-Q12), practice-exam-3 answers, avatorium server/index.js, signup-sheet server/index.js, glossary-mock-answers.md socket sections.*
