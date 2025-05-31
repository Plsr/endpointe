import { RequestPayload } from "@/app/app/page";
import { RequestMethod } from "@/lib/request";
import { debounce } from "@/util/debounce";
import { SendHorizonalIcon } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type RequestData = {
  url: string;
  method: RequestMethod;
  body?: string;
};
type Props = {
  data: RequestData;
  onUpdate: (payload: Partial<RequestData>) => void;
  onSubmit: (payload: RequestPayload) => void;
};

export const RequestDetails = ({ data, onUpdate, onSubmit }: Props) => {
  const [urlValue, setUrlValue] = useState(data.url);
  const [methodValue, setMethodValue] = useState(data.method);
  const [bodyValue, setBodyValue] = useState(data.body || "");

  const debouncedOnUpdate = useMemo(
    () => debounce((url: string) => onUpdate({ url }), 500),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    debouncedOnUpdate(urlValue);
  }, [urlValue, debouncedOnUpdate]);

  const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlValue(value);
  };

  const handleChangeBody = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBodyValue(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      url: urlValue,
      method: methodValue,
      body: ["POST", "PUT"].includes(methodValue) ? bodyValue : undefined,
    });
  };

  const showBodyField = ["POST", "PUT"].includes(methodValue);

  return (
    <div className="flex flex-col w-full gap-2">
      <form className="flex items-center flex-row gap-2 w-full border border-stone-700 rounded-md px-2">
        <select
          name="method"
          value={methodValue}
          onChange={(e) => setMethodValue(e.target.value as RequestMethod)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          type="text"
          className="w-full border-none p-2 focus:outline-none focus:ring-0 "
          placeholder="URL"
          value={urlValue}
          autoFocus
          onChange={handleChangeUrl}
        />
        <button type="submit" onClick={handleSubmit}>
          <SendHorizonalIcon className="w-4 h-4" />
        </button>
      </form>

      {showBodyField && (
        <textarea
          className="w-full p-2 border border-stone-700 rounded-md min-h-[100px]"
          placeholder="Request Body (JSON)"
          value={bodyValue}
          onChange={handleChangeBody}
        />
      )}
    </div>
  );
};
