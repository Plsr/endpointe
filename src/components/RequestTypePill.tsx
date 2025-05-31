import { RequestMethod } from "@/lib/request";

type Props = {
  method: RequestMethod;
};

export const RequestTypePill = ({ method }: Props) => {
  const getBgColor = () => {
    switch (method) {
      case "GET":
        return "bg-[#4c67b7] text-[#d0daf5]";
      case "POST":
        return "bg-[#4CB782] text-[#0d2117]";
      case "PUT":
      case "PATCH":
        return "bg-[#e6ad4c] text-[#241b0b]";
      case "DELETE":
        return "bg-[#b74c53] text-[#e3c3c6]";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div
      className={`inline text-[0.6rem] font-bold  ${getBgColor()} px-2 py-1 rounded-md`}
    >
      {method}
    </div>
  );
};
