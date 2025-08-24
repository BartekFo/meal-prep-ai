# Recipe Editing MVP - Technical Implementation Plan

## 1. Database Update Function
**Add to `src/lib/modules/recipes/db/queries.ts`:**
```typescript
export async function updateRecipeRecord(id: number, recipe: NewRecipe, userId: string) {
  return db.update(recipes)
    .set(recipe)
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)));
}
```

## 2. Edit Route Setup
**Create `src/routes/(authenticated)/recipes/[id]/edit/+page.server.ts`:**
- **Load function**: Use `superValidate(existingRecipe, arktype(RecipeFormSchema))` to populate form
- **Action**: Handle form submission with `updateRecipeRecord`
- **Pattern**: Copy from `/new/+page.server.ts` but replace create with update

## 3. Edit Form Component  
**Create `src/routes/(authenticated)/recipes/[id]/edit/+page.svelte`:**
- **Copy entire form** from `/new/+page.svelte` 
- **Key changes**: 
  - Form will be pre-populated via `superValidate` in load function
  - Change submit button text to "Update Recipe"
  - Update cancel navigation to go back to recipe detail page

## 4. UI Addition
**Add Edit button** to `src/routes/(authenticated)/recipes/[id]/+page.svelte`:
```svelte
<Button href="/recipes/{data.recipe.id}/edit">Edit Recipe</Button>
```

## Key Implementation Details:
- **Form Pre-population**: Superforms automatically populates form fields when you pass existing data to `superValidate`
- **Validation**: Reuse exact same `RecipeFormSchema` - no changes needed
- **Components**: All existing form field components work as-is
- **Image handling**: Keep existing image upload logic (optional for edits)

**Total new files**: 2 (server + page)
**Modified files**: 2 (add update query + edit button)