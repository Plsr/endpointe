type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type Props = {
  method: RequestMethod;
};

export const RequestTypePill = ({ method }: Props) => {
  const getBgColor = () => {
    switch (method) {
      case "GET":
        return "bg-blue-800";
      case "POST":
        return "bg-green-600";
      case "PUT":
      case "PATCH":
        return "bg-yellow-600";
      case "DELETE":
        return "bg-red-600";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div
      className={`inline text-xs text-white ${getBgColor()} px-2 py-1 rounded-md`}
    >
      {method}
    </div>
  );
};
