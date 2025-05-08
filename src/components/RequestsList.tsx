import { AppRequest } from "@/app/app/page";
import { RequestTypePill } from "./RequestTypePill";

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
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-sm">Requests</h2>
        <div className="text-xs px-2 py-1 rounded-md bg-stone-900 hover:bg-stone-800 border border-stone-800 cursor-pointer transition-all">
          Add new
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {requests.map((request) => (
          <RequestItem
            key={request.id}
            request={request}
            active={activeRequestId === request.id}
            onClick={() => {
              setActiveRequestId(request.id);
            }}
          />
        ))}
      </div>
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
      className={`p-2 flex flex-row items-start gap-2 overflow-hidden text-ellipsis cursor-pointer ${
        active ? "bg-stone-800 rounded-lg" : ""
      }`}
      onClick={handleClick}
    >
      <RequestTypePill method={request.method} />
      <span className="text-sm">{request.name}</span>
    </div>
  );
};
