"use client";

import { getUrlPayload } from "./actions";
import { useEffect, useState } from "react";
import { RequestsList } from "@/components/RequestsList";
import { RequestDetails } from "@/components/RequestDetails";
import { useHotkeyListener } from "@/hooks/useHotkeyListener";
import { AppRequest, createBareRequest, RequestMethod } from "@/lib/request";
import { CogIcon } from "lucide-react";
import Link from "next/link";

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
    hotkeys: ["c", "d", "ArrowUp", "ArrowDown"],
    onHotkeyPress: (key) => {
      if (key === "c") {
        addNewRequest();
      }

      if (key === "d") {
        deleteRequest(selectedRequestIndex);
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
    const updatedRequests = [...requests, { ...createBareRequest() }];
    setRequests(updatedRequests);
    setSelectedRequestIndex(updatedRequests.length - 1);
    saveRequests(requests);
  };

  const deleteRequest = (index: number) => {
    const updatedRequests = requests.toSpliced(index, 1);

    const indexToSelect =
      selectedRequestIndex >= updatedRequests.length
        ? updatedRequests.length - 1
        : selectedRequestIndex;

    setRequests(updatedRequests);
    setSelectedRequestIndex(indexToSelect);
    saveRequests(updatedRequests);
  };

  if (!requests || requests.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-2 flex flex-col max-h-screen">
        <RequestsList
          requests={requests}
          selectedRequestIndex={selectedRequestIndex}
          setSelectedRequestIndex={setSelectedRequestIndex}
          onAddRequest={addNewRequest}
        />
        <div className="mt-auto border-t border-t-stone-700 p-4">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-stone-900 hover:bg-stone-800 border border-stone-800 cursor-pointer transition-all"
          >
            <CogIcon className="w-4 h-4" /> Settings
          </Link>
        </div>
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

const EmptyState = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="text-lg font-bold">⤜(ⱺ ʖ̯ⱺ)⤏</div>
      <h2 className="text-xl font-bold mb-4">No requests yet</h2>
      <div>
        Press{" "}
        <div className="inline-flex border border-stone-600 rounded px-2">
          c
        </div>{" "}
        to create one
      </div>
    </div>
  );
};
