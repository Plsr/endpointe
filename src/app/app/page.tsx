"use client";

import { useAction } from "next-safe-action/hooks";
import { getUrlPayload } from "./actions";
import { useEffect, useState, useRef } from "react";
import { RequestsList } from "@/components/requestsList";

export const dynamic = "force-dynamic";

export default function App() {
  const { execute, result } = useAction(getUrlPayload);
  const [url, setUrl] = useState("");
  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<
    AppRequest | undefined
  >();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setRequests(getRequests());
    setSelectedRequest(getRequests()[0]);
  }, []);

  useEffect(() => {
    if (!selectedRequest) return;

    updateRequest(selectedRequest.id, { lastResponse: result.data });
    setSelectedRequest(getRequestById(selectedRequest.id));
    setRequests(getRequests());
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (typeof window === "undefined") return;
      // Only trigger on body
      if (!(event.target instanceof HTMLBodyElement)) {
        return;
      }

      if (event.key === "c") {
        createNewRequest();
        setRequests(getRequests());
        setSelectedRequest(getRequests()[getRequests().length - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Set initial URL from selected request
  useEffect(() => {
    if (selectedRequest) {
      setUrl(selectedRequest.url || "");
    }
  }, [selectedRequest]);

  // Update selected request URL with debounce
  useEffect(() => {
    if (!selectedRequest) return;

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      // Only update if the URL actually changed
      if (url !== selectedRequest.url) {
        updateRequest(selectedRequest.id, { url, name: url });
        setRequests(getRequests()); // Refresh requests list
      }
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [url, selectedRequest]);

  const handleSubmit = () => {
    execute({ url });
  };

  return (
    <div className="grid grid-cols-12">
      <div className="p-4 col-span-2">
        <RequestsList
          requests={requests}
          activeRequestId={selectedRequest?.id}
          setActiveRequestId={(requestId) =>
            setSelectedRequest(getRequestById(requestId))
          }
        />
      </div>
      <div className=" p-4 col-span-5">
        <div className="flex items-center flex-row gap-2 w-full">
          <input
            type="text"
            name="url"
            className="w-full"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <select
            name="method"
            value={selectedRequest?.method}
            onChange={(e) => {
              updateRequest(selectedRequest!.id, {
                method: e.target.value as RequestMethod,
              });
              setRequests(getRequests());
              setSelectedRequest(getRequestById(selectedRequest!.id));
            }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <button type="submit" onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
      <div className="p-4 col-span-5">
        <pre>{JSON.stringify(selectedRequest?.lastResponse, null, 2)}</pre>
      </div>
    </div>
  );
}

export type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type AppRequest = {
  id: string;
  url: string;
  name: string;
  method: RequestMethod;
  lastResponse: Record<string, string | number | boolean | null> | null;
  createdAt: Date;
};

const createNewRequest = () => {
  const bareRequest = {
    id: crypto.randomUUID(),
    url: "",
    name: "New Request",
    method: "GET",
    lastResponse: null,
    createdAt: new Date(),
  } satisfies AppRequest;

  const requests = getRequests();
  window.localStorage.setItem(
    "requests",
    JSON.stringify([...requests, bareRequest])
  );
};

const getRequests = () => {
  const requests = window.localStorage.getItem("requests");
  if (!requests) {
    return [];
  }
  return JSON.parse(requests) as AppRequest[];
};

const getRequestById = (requestId: string) => {
  const requests = getRequests();
  return requests.find((r) => r.id === requestId);
};

const updateRequest = (requestId: string, payload: Partial<AppRequest>) => {
  const requests = getRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  requests[index] = { ...requests[index], ...payload };
  window.localStorage.setItem("requests", JSON.stringify(requests));
};
