import { ResultAsync } from "neverthrow";
import { deleteRecipeRecord } from "../db/queries";

type DeleteRecipeProps = {
  id: number;
  userId: string;
};

export function deleteRecipe({ id, userId }: DeleteRecipeProps) {
  return ResultAsync.fromPromise(
    deleteRecipeRecord(id, userId),
    () => new Error("Failed to delete recipe")
  );
}
