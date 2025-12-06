import type { DbError } from '$lib/errors/db';
import { err, type Result } from 'neverthrow';
import { getRecipeById, type NewRecipe, updateRecipeRecord } from '../../db/queries';
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
	userId
}: UpdateRecipeProps): Promise<Result<NewRecipe, DbError | Error>> {
	// Get existing recipe to preserve current image if no new image is uploaded
	const existingRecipeResult = await getRecipeById(id, userId);
	if (existingRecipeResult.isErr()) {
		return err(existingRecipeResult.error);
	}

	const existingRecipe = existingRecipeResult.value;
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
		userId
	};

	const updateResult = await updateRecipeRecord(id, recipe, userId);
	if (updateResult.isErr()) {
		return err(updateResult.error);
	}

	return updateResult;
}
