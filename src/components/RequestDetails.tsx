import { RequestMethod } from "@/app/app/page";
import { debounce } from "@/util/debounce";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type RequestData = {
  url: string;
  method: RequestMethod;
};
type Props = {
  data: RequestData;
  onUpdate: (payload: Partial<RequestData>) => void;
  onSubmit: (url: string) => void;
};

export const RequestDetails = ({ data, onUpdate, onSubmit }: Props) => {
  const [urlValue, setUrlValue] = useState(data.url);

  const debouncedOnUpdate = useMemo(
    () => debounce((url: string) => onUpdate({ url }), 500),
    [onUpdate]
  );

  useEffect(() => {
    debouncedOnUpdate(urlValue);
  }, [urlValue, debouncedOnUpdate]);

  const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlValue(value);
  };

  const handleChangeMethod = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ method: e.target.value as RequestMethod });
  };

  const handleSubmit = () => {
    onSubmit(urlValue);
  };

  return (
    <div className="flex items-center flex-row gap-2 w-full">
      <input
        type="text"
        name="url"
        className="w-full"
        placeholder="URL"
        value={urlValue}
        onChange={handleChangeUrl}
      />
      <select name="method" value={data.method} onChange={handleChangeMethod}>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      <button type="submit" onClick={handleSubmit}>
        Send
      </button>
    </div>
  );
};
