"use client";

import { useAction } from "next-safe-action/hooks";
import { getUrlPayload } from "./actions";
import { useEffect, useState, useRef } from "react";
import { RequestTypePill } from "@/components/requestTypePill";

export default function App() {
  const { execute, result } = useAction(getUrlPayload);
  const [url, setUrl] = useState("");
  const [requests, setRequests] = useState<any[]>(getRequests());
  const [selectedRequest, setSelectedRequest] = useState<any>(getRequests()[0]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    updateRequest(selectedRequest.id, { lastResponse: result });
    setSelectedRequest(getRequestById(selectedRequest.id));
    setRequests(getRequests());
  }, [result]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
        {requests.map((request) => (
          <div
            key={request.id}
            className={`p-2 flex flex-row items-center gap-2 overflow-hidden text-ellipsis ${
              selectedRequest?.id === request.id ? "bg-gray-800" : ""
            }`}
            onClick={() => setSelectedRequest(request)}
          >
            <RequestTypePill method={request.method} />
            <span className="text-sm">{request.name}</span>
          </div>
        ))}
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
              updateRequest(selectedRequest.id, { method: e.target.value });
              setRequests(getRequests());
              setSelectedRequest(getRequestById(selectedRequest.id));
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
        <pre>{JSON.stringify(selectedRequest.lastResponse, null, 2)}</pre>
      </div>
    </div>
  );
}

type AppRequest = {
  id: string;
  url: string;
  name: string;
  method: string;
  lastResponse: any;
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
