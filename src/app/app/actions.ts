"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

const schema = z
  .object({
    url: z.string().min(1),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (["POST", "PUT", "PATCH"].includes(data.method) && !data.body) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Body is required for POST requests",
      });
    }
  });
export const getUrlPayload = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { url, method, body } }) => {
    const options: RequestInit = {
      method,
    };

    if (body && ["POST", "PUT", "PATCH"].includes(method)) {
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = body;
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  });
