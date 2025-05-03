"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { useAppForm } from "@/components/form";
import { Heading2, Heading3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useStore, useTransform } from "@tanstack/react-form";
import { initialFormState, mergeForm } from "@tanstack/react-form/nextjs";
import { useActionState } from "react";
import { AvatarUpload } from "../avatar-upload";
import saveUserDataAction from "./action";
import { onboardingStepOneFormOpts } from "./shared-form-code";

export function StepOne() {
  const [state, action] = useActionState(saveUserDataAction, initialFormState);

  const form = useAppForm({
    ...onboardingStepOneFormOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state],
    ),
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  console.log(formErrors);
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heading2>Welcome to Meal Prep AI</Heading2>
        <p className="text-muted-foreground">
          Let's start by getting to know you a little better.
        </p>
      </div>

      <form action={action} onSubmit={form.handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex flex-col items-center justify-center">
              <AvatarUpload value={""} onChange={() => {}} />
            </div>

            <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">
              <form.AppField
                name="firstName"
                children={(field) => (
                  <field.Item>
                    <field.Label>First Name</field.Label>
                    <field.Control>
                      <Input
                        name={field.name}
                        placeholder="First Name"
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
                name="lastName"
                children={(field) => (
                  <field.Item>
                    <field.Label>Last Name</field.Label>
                    <field.Control>
                      <Input
                        name={field.name}
                        placeholder="Last Name"
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
                name="dateOfBirth"
                children={(field) => (
                  <field.Item className="flex flex-col">
                    <field.Label>Date of Birth</field.Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <field.Control>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.state.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.state.value ? (
                              format(field.state.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <input
                              type="hidden"
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                              }}
                            />
                          </Button>
                        </field.Control>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          mode="single"
                          selected={
                            field.state.value
                              ? new Date(field.state.value)
                              : undefined
                          }
                          onSelect={(day) => {
                            field.handleChange(day?.toISOString() ?? "");
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <field.Message />
                  </field.Item>
                )}
              />

              <form.AppField
                name="gender"
                children={(field) => (
                  <field.Item>
                    <field.Label>Gender</field.Label>
                    <Select
                      name={field.name}
                      onValueChange={field.handleChange}
                      defaultValue={field.state.value}
                    >
                      <field.Control>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </field.Control>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <field.Message />
                  </field.Item>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Heading3 className="mb-4 font-medium text-lg">
              Fitness Goals
            </Heading3>
            <div className="space-y-4">
              <form.AppField
                name="activityLevel"
                children={(field) => (
                  <field.Item className="space-y-3">
                    <field.Label>Activity Level</field.Label>
                    <field.Control>
                      <RadioGroup
                        name={field.name}
                        onValueChange={field.handleChange}
                        defaultValue={field.state.value}
                        className="flex flex-col space-y-1"
                      >
                        <field.Item className="flex items-center space-x-3 space-y-0">
                          <field.Control>
                            <RadioGroupItem value="sedentary" id="sedentary" />
                          </field.Control>
                          <field.Label
                            htmlFor="sedentary"
                            className="font-normal"
                          >
                            Sedentary (little or no exercise)
                          </field.Label>
                        </field.Item>
                        <field.Item className="flex items-center space-x-3 space-y-0">
                          <field.Control>
                            <RadioGroupItem value="light" id="light" />
                          </field.Control>
                          <field.Label htmlFor="light" className="font-normal">
                            Light (exercise 1-3 days/week)
                          </field.Label>
                        </field.Item>
                        <field.Item className="flex items-center space-x-3 space-y-0">
                          <field.Control>
                            <RadioGroupItem value="moderate" id="moderate" />
                          </field.Control>
                          <field.Label
                            htmlFor="moderate"
                            className="font-normal"
                          >
                            Moderate (exercise 3-5 days/week)
                          </field.Label>
                        </field.Item>
                        <field.Item className="flex items-center space-x-3 space-y-0">
                          <field.Control>
                            <RadioGroupItem value="active" id="active" />
                          </field.Control>
                          <field.Label htmlFor="active" className="font-normal">
                            Active (exercise 6-7 days/week)
                          </field.Label>
                        </field.Item>
                        <field.Item className="flex items-center space-x-3 space-y-0">
                          <field.Control>
                            <RadioGroupItem
                              value="very-active"
                              id="very-active"
                            />
                          </field.Control>
                          <field.Label
                            htmlFor="very-active"
                            className="font-normal"
                          >
                            Very Active (hard exercise daily or 2x/day)
                          </field.Label>
                        </field.Item>
                      </RadioGroup>
                    </field.Control>
                    <field.Message />
                  </field.Item>
                )}
              />

              <Separator />

              <form.AppField
                name="weightGoal"
                children={(field) => (
                  <field.Item className="space-y-3">
                    <field.Label>Weight Goal</field.Label>
                    <field.Control>
                      <RadioGroup
                        name={field.name}
                        onValueChange={field.handleChange}
                        defaultValue={field.state.value}
                        className="flex flex-col space-y-1"
                      >
                        <field.Item className="flex items-center space-x-2 space-y-0">
                          <field.Control>
                            <RadioGroupItem value="lose" id="lose" />
                          </field.Control>
                          <field.Label htmlFor="lose">Lose weight</field.Label>
                        </field.Item>
                        <field.Item className="flex items-center space-x-2 space-y-0">
                          <field.Control>
                            <RadioGroupItem value="maintain" id="maintain" />
                          </field.Control>
                          <field.Label htmlFor="maintain">
                            Maintain weight
                          </field.Label>
                        </field.Item>
                        <field.Item className="flex items-center space-x-2 space-y-0">
                          <field.Control>
                            <RadioGroupItem value="gain" id="gain" />
                          </field.Control>
                          <field.Label htmlFor="gain">Gain weight</field.Label>
                        </field.Item>
                      </RadioGroup>
                    </field.Control>
                    <field.Message />
                  </field.Item>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" className="md:col-span-2">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
