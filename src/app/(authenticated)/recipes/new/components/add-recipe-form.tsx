"use client";

import Link from "next/link";

import { useAppForm } from "@/components/form";
import { Heading2 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore, useTransform } from "@tanstack/react-form";
import { initialFormState, mergeForm } from "@tanstack/react-form/nextjs";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useActionState } from "react";
import addRecipeAction from "../form-logic/action";
import { formOpts } from "../form-logic/shared-form-code";
import { RecipeDetailsFields } from "./recipe-details-fields";
import { RecipeFormCard } from "./recipe-form-card";

export function AddRecipeForm() {
  const [state, action] = useActionState(addRecipeAction, initialFormState);

  const form = useAppForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state],
    ),
  });

  const formErrors = useStore(form.store, (formState) => formState.errors)[0];

  console.log("formErrors", formErrors);

  return (
    <form
      action={action as never}
      onSubmit={() => {
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {/* {formErrors && Object.values(formErrors).map((error) => (
        <p key={error[0].message}>{error[0].message}</p>
      ))} */}
      <RecipeDetailsFields form={form} />

      <RecipeFormCard>
        <Heading2 className="mb-4 font-semibold text-xl">
          Nutrition Information
        </Heading2>
        <div className="grid gap-6 md:grid-cols-4">
          <form.AppField
            name="calories"
            children={(field) => (
              <field.Item>
                <field.Label>Calories</field.Label>
                <field.Control>
                  <Input
                    placeholder="0"
                    type="number"
                    min={0}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Message />
              </field.Item>
            )}
          />
          <form.AppField
            name="protein"
            children={(field) => (
              <field.Item>
                <field.Label>Protein (g)</field.Label>
                <field.Control>
                  <Input
                    placeholder="0"
                    type="number"
                    min={0}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Message />
              </field.Item>
            )}
          />

          <form.AppField
            name="carbs"
            children={(field) => (
              <field.Item>
                <field.Label>Carbs (g)</field.Label>
                <field.Control>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Message />
              </field.Item>
            )}
          />

          <form.AppField
            name="fat"
            children={(field) => (
              <field.Item>
                <field.Label>Fat (g)</field.Label>
                <field.Control>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Message />
              </field.Item>
            )}
          />
        </div>
      </RecipeFormCard>

      <RecipeFormCard>
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
      </RecipeFormCard>

      <RecipeFormCard>
        <Heading2 className="mb-4 font-semibold text-xl">
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
        </Heading2>
      </RecipeFormCard>

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
