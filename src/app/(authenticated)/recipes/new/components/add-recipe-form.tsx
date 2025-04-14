"use client";

import Link from "next/link";

import { useForm } from "@tanstack/react-form";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUpload } from "./image-upload";

const formSchema = z.object({
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters" }),
	image: z.string().optional(),
	prepTime: z.string().min(1, { message: "Prep time is required" }),
	cookTime: z.string().min(1, { message: "Cook time is required" }),
	servings: z.coerce
		.number()
		.int()
		.min(1, { message: "Servings must be at least 1" }),
	mealType: z.string().min(1, { message: "Meal type is required" }),
	calories: z.coerce
		.number()
		.int()
		.min(0, { message: "Calories must be a positive number" }),
	protein: z.coerce
		.number()
		.int()
		.min(0, { message: "Protein must be a positive number" }),
	carbs: z.coerce
		.number()
		.int()
		.min(0, { message: "Carbs must be a positive number" }),
	fat: z.coerce
		.number()
		.int()
		.min(0, { message: "Fat must be a positive number" }),
	ingredients: z
		.array(
			z.object({
				value: z.string().min(1, { message: "Ingredient cannot be empty" }),
			}),
		)
		.min(1, { message: "At least one ingredient is required" }),
	instructions: z
		.array(
			z.object({
				value: z.string().min(1, { message: "Instruction cannot be empty" }),
			}),
		)
		.min(1, { message: "At least one instruction is required" }),
});

type FormValues = z.infer<typeof formSchema>;

// This would be a server action in a real app
async function saveRecipe(data: FormValues) {
	// Simulate API call
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log("Recipe data:", data);
			resolve({ success: true });
		}, 1500);
	});
}

// TODO: Migrate to tanstack form
export function AddRecipeForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
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
			ingredients: [{ value: "" }],
			instructions: [{ value: "" }],
		},
	});

	const {
		fields: ingredientFields,
		append: appendIngredient,
		remove: removeIngredient,
	} = useFieldArray({
		control: form.control,
		name: "ingredients",
	});

	const {
		fields: instructionFields,
		append: appendInstruction,
		remove: removeInstruction,
	} = useFieldArray({
		control: form.control,
		name: "instructions",
	});

	async function onSubmit(data: FormValues) {
		try {
			setIsSubmitting(true);
			await saveRecipe(data);
			toast.success("Recipe created");
			router.push("/recipes");
		} catch (error) {
			toast.error("Error creating recipe");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<Card>
					<CardContent className="pt-6">
						<div className="grid gap-6 md:grid-cols-2">
							<div className="md:col-span-2">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Recipe Title</FormLabel>
											<FormControl>
												<Input placeholder="Enter recipe title" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="md:col-span-2">
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe your recipe"
													className="min-h-[100px]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="md:col-span-2">
								<FormField
									control={form.control}
									name="image"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Recipe Image</FormLabel>
											<FormControl>
												<ImageUpload
													value={field.value || ""}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormDescription>
												Upload an image of your recipe (optional)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="prepTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prep Time (minutes)</FormLabel>
										<FormControl>
											<Input type="text" placeholder="15" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="cookTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cook Time (minutes)</FormLabel>
										<FormControl>
											<Input type="text" placeholder="30" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="servings"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Servings</FormLabel>
										<FormControl>
											<Input type="number" min={1} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="mealType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Meal Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select meal type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="breakfast">Breakfast</SelectItem>
												<SelectItem value="lunch">Lunch</SelectItem>
												<SelectItem value="dinner">Dinner</SelectItem>
												<SelectItem value="snack">Snack</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<h2 className="mb-4 font-semibold text-xl">
							Nutrition Information
						</h2>
						<div className="grid gap-6 md:grid-cols-4">
							<FormField
								control={form.control}
								name="calories"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Calories</FormLabel>
										<FormControl>
											<Input type="number" min={0} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="protein"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Protein (g)</FormLabel>
										<FormControl>
											<Input type="number" min={0} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="carbs"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Carbs (g)</FormLabel>
										<FormControl>
											<Input type="number" min={0} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="fat"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fat (g)</FormLabel>
										<FormControl>
											<Input type="number" min={0} {...field} />
										</FormControl>
										<FormMessage />
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
								onClick={() => appendIngredient({ value: "" })}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Ingredient
							</Button>
						</div>

						{ingredientFields.map((field, index) => (
							<div key={field.id} className="mb-4 flex items-start gap-2">
								<FormField
									control={form.control}
									name={`ingredients.${index}.value`}
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<Input placeholder="e.g. 1 cup flour" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeIngredient(index)}
									disabled={ingredientFields.length === 1}
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
								onClick={() => appendInstruction({ value: "" })}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Step
							</Button>
						</div>

						{instructionFields.map((field, index) => (
							<div key={field.id} className="mb-4 flex items-start gap-2">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-sm">
									{index + 1}
								</div>

								<FormField
									control={form.control}
									name={`instructions.${index}.value`}
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<Textarea
													placeholder="Describe this step"
													className="min-h-[80px]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeInstruction(index)}
									disabled={instructionFields.length === 1}
								>
									<Trash2 className="h-4 w-4" />
									<span className="sr-only">Remove step</span>
								</Button>
							</div>
						))}
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Button variant="outline" type="button" asChild>
						<Link href="/recipes">Cancel</Link>
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isSubmitting ? "Saving..." : "Save Recipe"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
