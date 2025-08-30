# Migration Plan: Storing Images in Database

## Overview

This document outlines the migration from file-based image storage to database-based storage for recipe images. This change simplifies deployment and eliminates external file storage dependencies.

## Current State

- Images stored in `uploads/recipes/{userId}/` directory
- File paths stored in database
- Docker volume mounting required for persistence
- Separate file management complexity

## Target State

- Images stored as BYTEA in PostgreSQL
- No file system dependencies
- Simplified Docker deployment
- Atomic transactions for recipe + image data

## Migration Steps

### Phase 1: Database Schema Updates

1. **Add image columns to recipes table**
   ```sql
   ALTER TABLE recipes ADD COLUMN image_data BYTEA;
   ALTER TABLE recipes ADD COLUMN image_type VARCHAR(50);
   ALTER TABLE recipes ADD COLUMN image_size INTEGER;
   ```

2. **Generate migration file**
   ```bash
   bun run db:generate
   ```

3. **Apply migration**
   ```bash
   bun run db:migrate
   ```

### Phase 2: Storage Layer Updates

1. **Create database storage provider**
   - Implement `DatabaseStorage` class in `src/lib/storage.ts`
   - Add image compression/optimization
   - Handle MIME type validation

2. **Update storage factory**
   - Add 'database' option to `createStorage()`
   - Set as default for production

3. **Create image serving endpoint**
   - New API route: `/api/images/[id]`
   - Serve images directly from database
   - Add proper caching headers

### Phase 3: Application Updates

1. **Update upload actions**
   - Modify `upload-recipe-image.ts` to use database storage
   - Add image size validation (max 5MB recommended)
   - Add image format validation (JPEG, PNG, WebP)

2. **Update image display components**
   - Change image URLs from file paths to `/api/images/[recipeId]`
   - Update `recipe-image-upload.svelte`

3. **Update recipe queries**
   - Modify database queries to exclude image_data by default
   - Only fetch image_data when specifically needed
   - Add separate query for image serving

### Phase 4: Migration Script

1. **Create migration script**
   - Read existing images from filesystem
   - Convert to base64/buffer
   - Store in database with proper metadata
   - Verify data integrity

2. **Backup existing data**
   - Backup current uploads directory
   - Export current database

### Phase 5: Testing & Validation

1. **Test image upload flow**
2. **Test image display**
3. **Test recipe CRUD operations**
4. **Performance testing with multiple images**
5. **Test migration script with sample data**

### Phase 6: Deployment Updates

1. **Update Dockerfile**
   - Remove uploads directory dependencies
   - Remove volume mounting from docker-compose

2. **Update docker-compose.yml**
   - Remove recipe_uploads volume
   - Remove volume mounting

3. **Environment variables**
   - Set `STORAGE_PROVIDER=database` for production

## Implementation Details

### Database Storage Class

```typescript
class DatabaseStorage implements StorageProvider {
  async upload(file: File, path: string): Promise<string> {
    // Convert file to buffer
    // Store in database with metadata
    // Return recipe ID or image identifier
  }
  
  async delete(path: string): Promise<void> {
    // Remove image from database
  }
}
```

### Image Serving Endpoint

```typescript
// src/routes/api/images/[id]/+server.ts
export async function GET({ params }) {
  // Fetch image data from database
  // Return with proper headers and caching
}
```

### Performance Considerations

- **Image size limit**: Max 5MB per image
- **Image optimization**: Compress images before storage
- **Lazy loading**: Don't fetch image_data in recipe lists
- **Caching**: Add HTTP caching headers for image endpoints

## Rollback Plan

If issues arise:

1. Keep existing file storage code as backup
2. Switch `STORAGE_PROVIDER` back to 'local'
3. Restore from filesystem backup
4. Roll back database migration if necessary

## Benefits After Migration

- ✅ Simplified deployment (no volume mounts)
- ✅ Atomic transactions (recipe + image)
- ✅ No file system permissions issues
- ✅ Easier backup/restore (single database)
- ✅ Better data consistency
- ✅ Simplified Docker configuration

## Considerations

- Database size will increase
- Slightly higher memory usage when serving images
- PostgreSQL handles BYTEA efficiently for moderate sizes
- Perfect for MVP scale (hundreds of recipes)

## Timeline

- **Phase 1-2**: Database and storage updates (~4 hours)
- **Phase 3**: Application updates (~3 hours)
- **Phase 4**: Migration script (~2 hours)
- **Phase 5**: Testing (~2 hours)
- **Phase 6**: Deployment updates (~1 hour)

**Total estimated time**: ~12 hours of development work