import { RequestPayload } from "@/app/app/page";
import { RequestMethod } from "@/lib/request";
import { SendHorizonalIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

type RequestData = {
  url: string;
  method: RequestMethod;
  body?: string;
};

type Props = {
  data: RequestData;
  onSubmit: (payload: RequestPayload) => void;
};

export const RequestDetails = ({ data, onSubmit }: Props) => {
  const { register, handleSubmit, watch } = useForm<RequestData>({
    defaultValues: {
      body: data.body,
      url: data.url,
      method: data.method,
    },
  });

  const submitHandler: SubmitHandler<RequestData> = (data) => {
    onSubmit(data);
  };

  const selectedMethod = watch("method");

  const showBodyField = ["POST", "PUT"].includes(selectedMethod);

  return (
    <div className="flex flex-col w-full gap-2">
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="flex items-center flex-row gap-2 w-full border border-stone-700 rounded-md px-2">
          <select {...register("method")} name="method">
            <option defaultChecked value="GET">
              GET
            </option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            {...register("url", { required: true })}
            type="text"
            className="w-full border-none p-2 focus:outline-none focus:ring-0 "
            placeholder="URL"
          />

          <button type="submit">
            <SendHorizonalIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6">
          {showBodyField && (
            <textarea
              {...register("body")}
              className="w-full p-2 border border-stone-700 rounded-md min-h-[100px]"
              placeholder="Request Body (JSON)"
            />
          )}
        </div>
      </form>
    </div>
  );
};
