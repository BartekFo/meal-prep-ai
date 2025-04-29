import { withForm } from "@/components/form";
import { Heading2 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { recipeFormOpts } from "../form-logic/shared-form-code";
import { RecipeFormCard } from "./recipe-form-card";

export const IngredientsFields = withForm({
  ...recipeFormOpts,
  render: ({ form }) => {
    return (
      <RecipeFormCard>
        <form.AppField name="ingredients" mode="array">
          {(field) => {
            return (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <Heading2>Ingredients</Heading2>
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
    );
  },
});
