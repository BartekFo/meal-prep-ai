"use client";

import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Item: FormItem,
    Description: FormDescription,
    Label: FormLabel,
    Control: FormControl,
    Message: FormMessage,
    Input,
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
});

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-item"
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { state, name } = useFieldContext();

  return (
    <Label
      data-slot="form-label"
      data-error={state.meta.errors.length > 0}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={name}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { state, name } = useFieldContext();
  return (
    <Slot
      data-slot="form-control"
      id={name}
      aria-describedby={
        state.meta.errors.length > 0
          ? `${name}-form-description ${name}-form-message`
          : `${name}-form-description`
      }
      aria-invalid={state.meta.errors.length > 0}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { name } = useFieldContext();

  return (
    <p
      data-slot="form-description"
      id={`${name}-form-description`}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { state, name } = useFieldContext();
  const body =
    state.meta.errors.length > 0
      ? state.meta.errors[0].message
      : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={name}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

function FormSubmitButton({
  children,
  ...props
}: React.ComponentProps<"button">) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
    >
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit} {...props}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : children}
        </Button>
      )}
    </form.Subscribe>
  );
}
