"use client";

import { useAction } from "next-safe-action/hooks";
import { getUrlPayload } from "./actions";
import { useEffect, useState } from "react";
import { RequestsList } from "@/components/RequestsList";
import { RequestDetails } from "@/components/RequestDetails";
export default function App() {
  const { execute, result } = useAction(getUrlPayload);
  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<
    AppRequest | undefined
  >();

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

  const handleSubmit = (url: string) => {
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
        {selectedRequest && (
          <RequestDetails
            key={selectedRequest.id}
            data={selectedRequest}
            onUpdate={(payload) => updateRequest(selectedRequest.id, payload)}
            onSubmit={handleSubmit}
          />
        )}
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
