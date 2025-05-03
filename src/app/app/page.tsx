"use client";

import { useAction } from "next-safe-action/hooks";
import { getUrlPayload } from "./actions";
import { useState } from "react";

export default function App() {
  const { execute, result } = useAction(getUrlPayload);
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    execute({ url });
  };

  return (
    <div className="grid grid-cols-2">
      <div className=" p-4">
        <div className="flex items-center flex-row gap-2 w-full">
          <input
            type="text"
            name="url"
            className="w-full"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
      <div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
}
