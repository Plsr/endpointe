import { AppRequest } from "@/app/app/page";
import { RequestTypePill } from "./RequestTypePill";
import { useEffect } from "react";

type RequestsListProps = {
  requests: AppRequest[];
  activeRequestId?: string;
  setActiveRequestId: (requestId: string) => void;
};

export const RequestsList = ({
  requests,
  activeRequestId,
  setActiveRequestId,
}: RequestsListProps) => {
  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "j") {
        const currentIndex = requests.findIndex(
          (request) => request.id === activeRequestId
        );
        const nextIndex = currentIndex + 1;
        setActiveRequestId(requests[nextIndex].id);
      }

      if (event.key === "ArrowUp" || event.key === "k") {
        const currentIndex = requests.findIndex(
          (request) => request.id === activeRequestId
        );
        const nextIndex = currentIndex - 1;
        setActiveRequestId(requests[nextIndex].id);
      }
    };

    window.addEventListener("keydown", keydownListener);

    return () => {
      window.removeEventListener("keydown", keydownListener);
    };
  }, [activeRequestId, requests, setActiveRequestId]);

  return (
    <div className="flex flex-col gap-2">
      {requests.map((request) => (
        <RequestItem
          key={request.id}
          request={request}
          active={activeRequestId === request.id}
          onClick={() => setActiveRequestId(request.id)}
        />
      ))}
    </div>
  );
};

type RequestItemProps = {
  request: AppRequest;
  active: boolean;
  onClick: () => void;
};

const RequestItem = ({ request, active, onClick }: RequestItemProps) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div
      key={request.id}
      className={`p-2 flex flex-row items-center gap-2 overflow-hidden text-ellipsis ${
        active ? "bg-gray-800" : ""
      }`}
      onClick={handleClick}
    >
      <RequestTypePill method={request.method} />
      <span className="text-sm">{request.name}</span>
    </div>
  );
};
