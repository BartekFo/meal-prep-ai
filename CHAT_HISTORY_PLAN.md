# Chat History Implementation Plan

## Overview

Implement ChatGPT-style chat history sidebar for the AI Chef feature. Users will see a sidebar with current and previous chats, can create new chats, switch between them, and delete old ones.

## Database Schema (Already Exists)

- `chat` table: id, created_at, title, user_id
- `message` table: id, chat_id, role, parts (JSON), created_at

## Implementation Steps

### 1. Database Layer (`src/lib/modules/chef/db/queries.ts`)

Create query functions:

- `getChats(userId: string)` - Get all chats for user, ordered by created_at DESC
- `getChatById(chatId: string, userId: string)` - Get single chat with messages
- `createChat(userId: string, title: string)` - Create new chat
- `deleteChat(chatId: string, userId: string)` - Delete chat and its messages
- `saveMessage(chatId: string, role: string, parts: any)` - Save message to DB
- `updateChatTitle(chatId: string, title: string)` - Update chat title

### 2. API Endpoints

#### Update `/api/chat/+server.ts`

- Accept optional `chatId` in request body
- Create new chat if `chatId` not provided
- Save all messages (user and assistant) to database
- Return chatId in response

#### New `/api/chats/+server.ts`

- `GET` - List all chats for authenticated user
- `POST` - Create new chat, return chatId

#### New `/api/chats/[id]/+server.ts`

- `GET` - Get chat with messages
- `DELETE` - Delete chat

### 3. UI Components

#### ChatHistorySidebar Component (`src/lib/modules/chef/components/chat-history-sidebar.svelte`)

- Display list of chats (title, date)
- "New Chat" button at top
- Active chat highlighting
- Delete button for each chat
- Click to switch chats
- Collapsible/responsive design

### 4. Chef Page Updates (`src/routes/(authenticated)/chef/+page.svelte`)

- Add `chatId` URL parameter support (`/chef?chatId=xxx`)
- Load chat history on mount
- Load messages from DB when `chatId` is present
- Initialize Chat component with existing messages
- Create new chat when no `chatId` or starting fresh
- Update URL when switching chats
- Auto-generate title from first user message

### 5. Chat Component Integration

- Initialize Chat with `initialMessages` from database
- Save messages to DB after each exchange
- Handle chat creation flow

## Technical Details

### Message Format

Messages stored as JSON in `parts` field:

```json
[
  { "type": "text", "text": "message content" },
  { "type": "tool-generateRecipe", ... }
]
```

### Title Generation

- Generate title from first user message (truncate to ~50 chars)
- Update chat title after first message exchange

### URL Structure

- `/chef` - New chat
- `/chef?chatId=xxx` - Existing chat

### Sidebar Behavior

- Show on desktop, hide on mobile (or use sheet/drawer)
- Persist scroll position
- Show last message preview or date

## Files to Create/Modify

### New Files

- `src/lib/modules/chef/db/queries.ts`
- `src/lib/modules/chef/components/chat-history-sidebar.svelte`
- `src/routes/(authenticated)/api/chats/+server.ts`
- `src/routes/(authenticated)/api/chats/[id]/+server.ts`

### Modified Files

- `src/routes/(authenticated)/api/chat/+server.ts`
- `src/routes/(authenticated)/chef/+page.svelte`
- `src/lib/modules/chef/components/index.ts`
