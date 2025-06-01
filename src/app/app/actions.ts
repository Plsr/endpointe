"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

const schema = z
  .object({
    url: z.string().min(1),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z.string().optional(),
    headers: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .optional(),
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
  .action(async ({ parsedInput: { url, method, body, headers } }) => {
    const options: RequestInit = {
      method,
    };

    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");
    if (headers) {
      headers.forEach((header) =>
        requestHeaders.append(header.key, header.value)
      );
    }

    if (body && ["POST", "PUT", "PATCH"].includes(method)) {
      options.body = body;
    }

    options.headers = requestHeaders;

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  });
