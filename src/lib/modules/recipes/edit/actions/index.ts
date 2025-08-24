import { ResultAsync } from 'neverthrow';
import { updateRecipeRecord, type NewRecipe } from '../../db/queries';
import type { IRecipeFormValues } from '../../new/schema';
import { uploadRecipeImage } from '../../new/actions/upload-recipe-image';

interface UpdateRecipeProps {
	id: number;
	formData: IRecipeFormValues;
	userId: string;
}

export async function updateRecipe({ id, formData, userId }: UpdateRecipeProps) {
	const imageUrl = await uploadRecipeImage(formData.image, userId);

	const recipe: NewRecipe = {
		...formData,
		imageUrl: imageUrl.isOk() ? imageUrl.value : null,
		userId
	};

	return ResultAsync.fromPromise(
		updateRecipeRecord(id, recipe, userId),
		() => new Error('Failed to update recipe')
	);
}