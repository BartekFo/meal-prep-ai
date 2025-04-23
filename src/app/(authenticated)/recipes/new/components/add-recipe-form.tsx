"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type IRecipeFormValues, recipeFormSchema } from "../schema";
import { ImageUpload } from "./image-upload";

async function saveRecipe(data: IRecipeFormValues) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Recipe data:", data);
      resolve({ success: true });
    }, 1500);
  });
}

const defatultRecipeFormValues: IRecipeFormValues = {
  title: "",
  description: "",
  image: "",
  prepTime: "",
  cookTime: "",
  servings: 4,
  mealType: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  ingredients: [],
  instructions: [],
};

export function AddRecipeForm() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: defatultRecipeFormValues,
    validators: {
      onSubmit: recipeFormSchema,
    },
    onSubmit: async ({ value }) => {
      await saveRecipe(value);
      toast.success("Recipe created");
      router.push("/recipes");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <form.AppField
                name="title"
                children={(field) => (
                  <field.Item>
                    <field.Label>Recipe Title</field.Label>
                    <field.Control>
                      <Input
                        placeholder="Enter recipe title"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.Control>
                    <field.Message />
                  </field.Item>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <form.AppField
                name="description"
                children={(field) => (
                  <field.Item>
                    <field.Label>Description</field.Label>
                    <field.Control>
                      <Textarea
                        placeholder="Describe your recipe"
                        className="min-h-[100px]"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.Control>
                    <field.Message />
                  </field.Item>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <form.AppField
                name="image"
                children={(field) => (
                  <field.Item>
                    <field.Label>Recipe Image</field.Label>
                    <field.Control>
                      <ImageUpload
                        value={field.state.value || ""}
                        onChange={field.handleChange}
                      />
                    </field.Control>
                    <field.Description>
                      Upload an image of your recipe (optional)
                    </field.Description>
                    <field.Message />
                  </field.Item>
                )}
              />
            </div>

            <form.AppField
              name="prepTime"
              children={(field) => (
                <field.Item>
                  <field.Label>Prep Time (minutes)</field.Label>
                  <field.Control>
                    <Input
                      type="text"
                      placeholder="15"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </field.Control>
                  <field.Message />
                </field.Item>
              )}
            />

            <form.AppField
              name="cookTime"
              children={(field) => (
                <field.Item>
                  <field.Label>Cook Time (minutes)</field.Label>
                  <field.Control>
                    <Input
                      type="text"
                      placeholder="30"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </field.Control>
                  <field.Message />
                </field.Item>
              )}
            />

            <form.AppField
              name="servings"
              children={(field) => (
                <field.Item>
                  <Label>Servings</Label>
                  <field.Control>
                    <Input
                      type="number"
                      min={1}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value ? Number(e.target.value) : 0,
                        )
                      }
                    />
                  </field.Control>
                  <field.Message />
                </field.Item>
              )}
            />

            <form.AppField
              name="mealType"
              children={(field) => (
                <field.Item>
                  <field.Label>Meal Type</field.Label>
                  <field.Control>
                    <Select
                      onValueChange={field.handleChange}
                      defaultValue={field.state.value}
                      value={field.state.value}
                      onOpenChange={field.handleBlur}
                    >
                      <div>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </field.Control>
                  <field.Message />
                </field.Item>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* <Card>
				<CardContent className="pt-6">
					<h2 className="mb-4 font-semibold text-xl">Nutrition Information</h2>
					<div className="grid gap-6 md:grid-cols-4">
						<form.Field
							name="calories"
							children={(field) => (
								<FormItem>
									<FormLabel>Calories</FormLabel>
									<Input
										type="number"
										min={0}
										value={String(field.state.value)}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value ? Number(e.target.value) : "",
											)
										}
									/>
									{field.state.meta.errors ? (
										<FormMessage>
											{field.state.meta.errors.join(", ")}
										</FormMessage>
									) : null}
								</FormItem>
							)}
						/>

						<form.Field
							name="protein"
							children={(field) => (
								<FormItem>
									<FormLabel>Protein (g)</FormLabel>
									<Input
										type="number"
										min={0}
										value={String(field.state.value)}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value ? Number(e.target.value) : "",
											)
										}
									/>
									{field.state.meta.errors ? (
										<FormMessage>
											{field.state.meta.errors.join(", ")}
										</FormMessage>
									) : null}
								</FormItem>
							)}
						/>

						<form.Field
							name="carbs"
							children={(field) => (
								<FormItem>
									<FormLabel>Carbs (g)</FormLabel>
									<Input
										type="number"
										min={0}
										value={String(field.state.value)}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value ? Number(e.target.value) : "",
											)
										}
									/>
									{field.state.meta.errors ? (
										<FormMessage>
											{field.state.meta.errors.join(", ")}
										</FormMessage>
									) : null}
								</FormItem>
							)}
						/>

						<form.Field
							name="fat"
							children={(field) => (
								<FormItem>
									<FormLabel>Fat (g)</FormLabel>
									<Input
										type="number"
										min={0}
										value={String(field.state.value)}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value ? Number(e.target.value) : "",
											)
										}
									/>
									{field.state.meta.errors ? (
										<FormMessage>
											{field.state.meta.errors.join(", ")}
										</FormMessage>
									) : null}
								</FormItem>
							)}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-xl">Ingredients</h2>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addIngredient} // Call local state function
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Ingredient
						</Button>
					</div>

					{ingredients.map((ingredient, index) => (
						// Use a unique key for each item
						<div key={index} className="mb-4 flex items-start gap-2">
							<form.Field
								name={`ingredients[${index}].value`}
								validators={{
									onChange: formSchema.shape.ingredients.element.shape.value,
								}}
								children={(field) => (
									<FormItem className="flex-1">
										<Input
											placeholder="e.g. 1 cup flour"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{field.state.meta.errors ? (
											<FormMessage>
												{field.state.meta.errors.join(", ")}
											</FormMessage>
										) : null}
									</FormItem>
								)}
							/>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => removeIngredient(index)} // Call local state function
								disabled={ingredients.length === 1}
							>
								<Trash2 className="h-4 w-4" />
								<span className="sr-only">Remove ingredient</span>
							</Button>
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-xl">Instructions</h2>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addInstruction} // Call local state function
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Step
						</Button>
					</div>

					{instructions.map((instruction, index) => (
						// Use a unique key for each item
						<div key={index} className="mb-4 flex items-start gap-2">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-sm">
								{index + 1}
							</div>
							<form.Field
								name={`instructions[${index}].value`}
								validators={{
									onChange: formSchema.shape.instructions.element.shape.value,
								}}
								children={(field) => (
									<FormItem className="flex-1">
										<Textarea
											placeholder="Describe this step"
											className="min-h-[80px]"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{field.state.meta.errors ? (
											<FormMessage>
												{field.state.meta.errors.join(", ")}
											</FormMessage>
										) : null}
									</FormItem>
								)}
							/>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => removeInstruction(index)} // Call local state function
								disabled={instructions.length === 1}
							>
								<Trash2 className="h-4 w-4" />
								<span className="sr-only">Remove step</span>
							</Button>
						</div>
					))}
				</CardContent>
			</Card> */}

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" asChild>
          <Link href="/recipes">Cancel</Link>
        </Button>
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {form.state.isSubmitting ? "Saving..." : "Save Recipe"}
        </Button>
      </div>
    </form>
  );
}
