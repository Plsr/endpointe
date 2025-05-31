export type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type AppRequest = {
  id: string;
  url: string;
  name: string;
  method: RequestMethod;
  body?: string;
  lastResponse: Record<string, string | number | boolean | null> | null;
  createdAt: Date;
};

export const createBareRequest = () =>
  ({
    id: crypto.randomUUID(),
    url: "",
    name: "New Request",
    method: "GET",
    body: "",
    lastResponse: null,
    createdAt: new Date(),
  }) satisfies AppRequest;
