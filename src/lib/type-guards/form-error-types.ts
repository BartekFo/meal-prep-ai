import type { BaseIssue } from "valibot";

export type ClientSideErrors = {
  [fieldName: string]: unknown[];
};

export type ServerSideErrors = BaseIssue<unknown>[];

export function isServerSideErrors(
  errors: unknown,
): errors is ServerSideErrors {
  return (
    Array.isArray(errors) &&
    (errors.length === 0 ||
      (typeof errors[0] === "object" &&
        errors[0] !== null &&
        "kind" in errors[0] &&
        "type" in errors[0] &&
        "input" in errors[0] &&
        "expected" in errors[0] &&
        "received" in errors[0] &&
        "message" in errors[0]))
  );
}
