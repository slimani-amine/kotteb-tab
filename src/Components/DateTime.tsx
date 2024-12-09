import React from "react";
import { useDateTime } from "../Hooks";

export const DateTime: React.FC = () => {
  const [dateNow, timeNow] = useDateTime();

  return (
    <div className="text-white text-center select-none">
      <p className="text-[6rem] ">{timeNow}</p>
    </div>
  );
};
