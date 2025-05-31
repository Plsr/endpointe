"use client";

import { getUrlPayload } from "./actions";
import { useEffect, useState } from "react";
import { RequestsList } from "@/components/RequestsList";
import { RequestDetails } from "@/components/RequestDetails";
import { useHotkeyListener } from "@/hooks/useHotkeyListener";

export type RequestPayload = {
  url: string;
  method: RequestMethod;
  body?: string;
};

const DEFAULT_REQUEST_NAME = "New Request";

export default function App() {
  const [requests, setRequests] = useState<AppRequest[]>([]);

  const [selectedRequestIndex, setSelectedRequestIndex] = useState<number>(0);
  console.log("selectedRequestIndex", selectedRequestIndex);

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  useHotkeyListener({
    hotkeys: ["c", "ArrowUp", "ArrowDown"],
    onHotkeyPress: (key) => {
      if (key === "c") {
        addNewRequest();
      }

      if (key === "ArrowUp") {
        setSelectedRequestIndex((prev) =>
          prev > 0 ? prev - 1 : requests.length - 1
        );
      }

      if (key === "ArrowDown") {
        setSelectedRequestIndex((prev) =>
          prev < requests.length - 1 ? prev + 1 : 0
        );
      }
    },
  });

  // TODO: Will not scale well with many requests, probably
  const handleSubmit = async (payload: RequestPayload) => {
    const { url, method, body } = payload;
    const result = await getUrlPayload({ url, method, body });

    if (!result) {
      // TODO: Error handling
      return;
    }

    const requestsCopy = [...requests];
    const updatedRequest = {
      ...requestsCopy[selectedRequestIndex],
      name: getUpdatedRequestName(requestsCopy[selectedRequestIndex].name, url),
      method,
      url,
      body,
    };

    if (result?.serverError) {
      // TODO: Error handling
      console.error(result.serverError);
    }

    if (result?.validationErrors) {
      // TODO: Error handling
      console.error(result.validationErrors);
    }

    if (result?.data) {
      updatedRequest.lastResponse = result.data;
    }

    requestsCopy[selectedRequestIndex] = updatedRequest;
    setRequests(requestsCopy);
    saveRequests(requestsCopy);
  };

  const handleUpdateRequest = (
    _requestId: string,
    _payload: Partial<AppRequest>
  ) => {
    // noop
    console.log("handleUpdateRequest", _requestId, _payload);
  };

  const addNewRequest = () => {
    createNewRequest();
    setRequests(getRequests());
    setSelectedRequestIndex(getRequests().length - 1);
  };

  if (!requests || requests.length === 0) {
    return <div>No requests</div>;
  }

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="p-4 col-span-2">
        <RequestsList
          requests={requests}
          selectedRequestIndex={selectedRequestIndex}
          setSelectedRequestIndex={setSelectedRequestIndex}
          onAddRequest={addNewRequest}
        />
      </div>
      <div className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-4 col-span-10 grid grid-cols-12 bg-stone-900  max-h-full border border-stone-800 overflow-scroll">
        <div className=" px-4 col-span-6">
          <RequestDetails
            key={requests[selectedRequestIndex].id}
            data={requests[selectedRequestIndex]}
            onUpdate={(payload) =>
              handleUpdateRequest(requests[selectedRequestIndex].id, payload)
            }
            onSubmit={handleSubmit}
          />
        </div>
        <div className="p-4 col-span-6  border border-stone-700 rounded-lg bg-stone-800 text-sm overflow-scroll">
          <pre>
            {JSON.stringify(
              requests[selectedRequestIndex]?.lastResponse,
              null,
              2
            )}
          </pre>
        </div>
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
  body?: string;
  lastResponse: Record<string, string | number | boolean | null> | null;
  createdAt: Date;
};

const createNewRequest = () => {
  const bareRequest = {
    id: crypto.randomUUID(),
    url: "",
    name: DEFAULT_REQUEST_NAME,
    method: "GET",
    body: "",
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

const saveRequests = (requests: AppRequest[]) => {
  window.localStorage.setItem("requests", JSON.stringify(requests));
};

const getUpdatedRequestName = (currentName: string, url: string): string => {
  if (currentName === DEFAULT_REQUEST_NAME) {
    return url;
  }
  return currentName;
};
