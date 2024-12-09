import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";

const BusDeparture = () => {
  const [timeLeft, setTimeLeft] = useState("");

  // date 2 minutes into future
  const departureTime = new Date(Date.now());
  departureTime.setMinutes(departureTime.getMinutes() + 2);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const timeLeft = dayjs(departureTime).diff(now, "minute");
      setTimeLeft(timeLeft > 0 ? `${timeLeft}'` : "Indul!");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between items-center ml-1 mr-2">
      <div className="flex gap-1">
        <div className="flex gap-1 items-center h-6 bg-cyan-600 pl-1 pr-1.5 rounded-full">
          <Icon
            icon="mdi:bus"
            className="text-xl p-0.5 rounded-full bg-white text-cyan-600"
          />
          <span className="font-bold">123E</span>
        </div>
        <h2 className="self-center">Keleti felé</h2>
      </div>
      <span className="font-bold">{timeLeft}</span>
    </div>
  );
};

export default BusDeparture;