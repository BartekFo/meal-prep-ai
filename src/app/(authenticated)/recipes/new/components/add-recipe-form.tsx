"use client";

import Link from "next/link";

import { Heading2 } from "@/components/typography";
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
import { MEAL_TYPES } from "@/lib/constants/meal-types";
import { useStore, useTransform } from "@tanstack/react-form";
import { initialFormState, mergeForm } from "@tanstack/react-form/nextjs";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useActionState } from "react";
import addRecipeAction from "../form-logic/action";
import { formOpts } from "../form-logic/shared-code";

export function AddRecipeForm() {
  const [state, action] = useActionState(addRecipeAction, initialFormState);

  const form = useAppForm({
    ...formOpts,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
  });

  const formErrors = useStore(form.store, (formState) => formState.errors)[0];

  console.log("formErrors", formErrors);

  return (
    <form
      action={action as never}
      onSubmit={() => {
        form.handleSubmit();
      }}
      encType="multipart/form-data"
      className="space-y-8"
    >
      {/* {formErrors && Object.values(formErrors).map((error) => (
        <p key={error[0].message}>{error[0].message}</p>
      ))} */}
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
                        name={field.name}
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
                        name={field.name}
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
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.handleChange(file);
                        }}
                      />
                      {/* <ImageUpload
                        value={field.state.value}
                        onChange={(file) => {
                          field.handleChange(file);
                          const input = document.getElementById(
                            "actual-image-upload",
                          ) as HTMLInputElement;
                          if (input) {
                            const dataTransfer = new DataTransfer();
                            if (file) {
                              dataTransfer.items.add(file);
                            }
                            input.files = dataTransfer.files;
                          }
                        }}
                      /> */}
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
                      name={field.name}
                      type="number"
                      min={1}
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
                      name={field.name}
                      type="number"
                      min={1}
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
                      name={field.name}
                      type="number"
                      min={1}
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
              name="mealType"
              children={(field) => (
                <field.Item>
                  <field.Label>Meal Type</field.Label>
                  <field.Control>
                    <Select
                      name={field.name}
                      onValueChange={field.handleChange}
                      defaultValue={field.state.value}
                      value={field.state.value}
                      onOpenChange={field.handleBlur}
                    >
                      <div>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        <SelectItem value={MEAL_TYPES[0]}>
                          {MEAL_TYPES[0]}
                        </SelectItem>
                        <SelectItem value={MEAL_TYPES[1]}>
                          {MEAL_TYPES[1]}
                        </SelectItem>
                        <SelectItem value={MEAL_TYPES[2]}>
                          {MEAL_TYPES[2]}
                        </SelectItem>
                        <SelectItem value={MEAL_TYPES[3]}>
                          {MEAL_TYPES[3]}
                        </SelectItem>
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

      <Card>
        <CardContent className="pt-6">
          <form.AppField name="ingredients" mode="array">
            {(field) => {
              return (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <Heading2 className="font-semibold text-xl">
                      Ingredients
                    </Heading2>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.pushValue("")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Ingredient
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {field.state.value.length > 0 &&
                      field.state.value.map((_, i) => {
                        return (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <form.AppField key={i} name={`ingredients[${i}]`}>
                            {(subField) => {
                              return (
                                <div
                                  key={subField.name}
                                  className="flex items-start gap-2"
                                >
                                  <subField.Item className="flex-1">
                                    <subField.Control>
                                      <Input
                                        name={subField.name}
                                        placeholder="e.g. 1 cup flour"
                                        value={subField.state.value}
                                        onBlur={subField.handleBlur}
                                        onChange={(e) =>
                                          subField.handleChange(e.target.value)
                                        }
                                      />
                                    </subField.Control>
                                    <subField.Message />
                                  </subField.Item>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => field.removeValue(i)}
                                    disabled={field.state.value.length === 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">
                                      Remove ingredient
                                    </span>
                                  </Button>
                                </div>
                              );
                            }}
                          </form.AppField>
                        );
                      })}
                  </div>
                </>
              );
            }}
          </form.AppField>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form.AppField name="instructions" mode="array">
            {(field) => {
              return (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <Heading2 className="font-semibold text-xl">
                      Instructions
                    </Heading2>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.pushValue("")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Step
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {field.state.value.length > 0 &&
                      field.state.value.map((_, i) => {
                        return (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <form.AppField key={i} name={`instructions[${i}]`}>
                            {(subField) => {
                              return (
                                <div
                                  key={subField.name}
                                  className="flex items-start gap-2"
                                >
                                  <subField.Item className="flex-1">
                                    <subField.Control>
                                      <Textarea
                                        name={subField.name}
                                        placeholder="Describe this step"
                                        className="min-h-[80px]"
                                        value={subField.state.value}
                                        onBlur={subField.handleBlur}
                                        onChange={(e) =>
                                          subField.handleChange(e.target.value)
                                        }
                                      />
                                    </subField.Control>
                                    <subField.Message />
                                  </subField.Item>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => field.removeValue(i)}
                                    disabled={field.state.value.length === 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove step</span>
                                  </Button>
                                </div>
                              );
                            }}
                          </form.AppField>
                        );
                      })}
                  </div>
                </>
              );
            }}
          </form.AppField>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" asChild>
          <Link href="/recipes">Cancel</Link>
        </Button>
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Saving..." : "Save Recipe"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
