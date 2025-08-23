import { ResultAsync } from 'neverthrow';
import { createRecipeRecord, type NewRecipe } from '../db/queries';
import type { IRecipeFormValues } from '../schema';
import { uploadRecipeImage } from './upload-recipe-image';

interface CreateRecipeProps {
	formData: IRecipeFormValues;
	userId: string;
}

export async function createRecipe({ formData, userId }: CreateRecipeProps) {
	const imageUrl = await uploadRecipeImage(formData.image, userId);

	const recipe: NewRecipe = {
		...formData,
		imageUrl: imageUrl.isOk() ? imageUrl.value : null,
		userId
	};

	return ResultAsync.fromPromise(
		createRecipeRecord(recipe),
		() => new Error('Failed to create recipe')
	);
}
