import { ResultAsync } from 'neverthrow';
import {
  getRecipeById,
  type NewRecipe,
  updateRecipeRecord,
} from '../../db/queries';
import { uploadRecipeImage } from '../../new/actions/upload-recipe-image';
import type { IRecipeFormValues } from '../../new/schema';

type UpdateRecipeProps = {
  id: number;
  formData: IRecipeFormValues;
  userId: string;
};

export async function updateRecipe({
  id,
  formData,
  userId,
}: UpdateRecipeProps) {
  // Get existing recipe to preserve current image if no new image is uploaded
  const existingRecipe = await getRecipeById(id, userId);
  if (!existingRecipe) {
    return ResultAsync.fromPromise(
      Promise.reject(new Error('Recipe not found')),
      () => new Error('Recipe not found')
    );
  }

  let imageUrl = existingRecipe.imageUrl; // Preserve existing image by default

  // Only upload new image if one was provided
  if (formData.image && formData.image.size > 0) {
    const uploadResult = await uploadRecipeImage(formData.image, userId);
    if (uploadResult.isOk()) {
      imageUrl = uploadResult.value;
    }
    // If upload fails, keep the existing image
  }

  const recipe: NewRecipe = {
    ...formData,
    imageUrl,
    userId,
  };

  return ResultAsync.fromPromise(
    updateRecipeRecord(id, recipe, userId),
    () => new Error('Failed to update recipe')
  );
}
