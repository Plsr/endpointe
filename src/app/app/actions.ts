"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

const schema = z.object({
  url: z.string().min(1),
});

export const getUrlPayload = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { url } }) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  });
