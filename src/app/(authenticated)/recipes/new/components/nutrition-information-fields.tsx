import { withForm } from "@/components/form";
import { Heading2 } from "@/components/typography";
import { Input } from "@/components/ui/input";
import { recipeFormOpts } from "../form-logic/shared-form-code";
import { RecipeFormCard } from "./recipe-form-card";

export const NutritionInformationFields = withForm({
  ...recipeFormOpts,
  render: ({ form }) => {
    return (
      <RecipeFormCard>
        <Heading2 className="mb-4 font-semibold text-xl">
          Nutrition Information
        </Heading2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <form.AppField
            name="calories"
            children={(field) => (
              <field.Item>
                <field.Label>Calories</field.Label>
                <field.Control>
                  <Input
                    name={field.name}
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
                    name={field.name}
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
                    name={field.name}
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
                    name={field.name}
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
    );
  },
});
