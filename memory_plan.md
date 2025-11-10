# Mem0 Integration Plan

## Decision: Use mem0ai Built-in MemoryVectorStore

**Why**: SQLite-based, self-hosted, TypeScript native, already installed

## Implementation Tasks

### Phase 1: Memory Module Setup

- [ ] Create `/src/lib/server/memory/index.ts`
- [ ] Initialize Memory with MemoryVectorStore (default provider)
- [ ] Configure embedder (OpenAI text-embedding-3-small)
- [ ] Configure LLM (reuse Gemini API)
- [ ] Set history path: `./data/mem0-history.db`

### Phase 2: Chat Integration

- [ ] Update `/api/chat/+server.ts` to retrieve memories
- [ ] Inject memories into system prompt
- [ ] Save memories after responses
- [ ] Seed initial memories from user profile

### Phase 3: Recipe Enhancement

- [ ] Update recipe generation tool with memory context
- [ ] Test preference compliance

### Phase 4: Maintenance

- [ ] Add memory update on profile changes
- [ ] Update backup script for mem0-history.db

## Storage

- Main: `db.sqlite` (existing)
- Memory: `mem0-history.db` (new, SQLite)
