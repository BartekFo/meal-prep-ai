import { withForm } from "@/components/form";
import { Heading2 } from "@/components/typography";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MEAL_TYPES, type MealType } from "@/lib/constants/meal-types";
import { recipeFormOpts } from "../form-logic/shared-form-code";
import { RecipeFormCard } from "./recipe-form-card";
import { RecipeImageUpload } from "./recipe-image-upload";

export const RecipeDetailsFields = withForm({
  ...recipeFormOpts,
  render: ({ form }) => {
    return (
      <RecipeFormCard>
        <Heading2 className="mb-4 font-semibold text-xl">
          Recipe Details
        </Heading2>
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
                    <RecipeImageUpload
                      name={field.name}
                      value={field.state.value as File}
                      onChange={(file) => {
                        field.handleChange(file);
                      }}
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
                <field.Label>Servings</field.Label>
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
                    onValueChange={(value: MealType) =>
                      field.handleChange(value)
                    }
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
      </RecipeFormCard>
    );
  },
});
