import React from "react";

export const Donate: React.FC = () => {
  return (
    <div className="bg-black bg-opacity-60 rounded-lg p-2 text-center w-[500px] flex items-center justify-center text-white">
      <p className="text-xl font-semibold" dir="rtl">
        Risk of famine looms over children in Gaza!{" "}
        <a
          href="https://help.unicef.org/mena/donate-to-children?gad_source=1&gclid=Cj0KCQiAu8W6BhC-ARIsACEQoDAjJBm5kpW8sFLQUVPIVpUOouzYs18llk1MDfrCO0meK0qL9RX_ozEaAoOjEALw_wcB"
          target="_blank"
          className="text-[#FECA30] hover:underline font-bold"
        >
          Donate now
        </a>
      </p>
    </div>
  );
};
