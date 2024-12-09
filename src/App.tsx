import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import hu from "dayjs/locale/hu";
import relativeTime from "dayjs/plugin/relativeTime";
import Substitutions from "./components/Substitutions";
import "./App.css";

dayjs.locale(hu);
dayjs.extend(relativeTime);

function App() {
  const [clockText, setClockText] = useState(["", "Betöltés..."]);
  useEffect(() => {
    const interval = setInterval(() => {
      const dateText = dayjs().format("YYYY. MMMM DD. dddd");
      const clockText = dayjs().format("HH:mm:ss");
      setClockText([dateText, clockText]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-full bg-gradient-to-br from-petrik-1 to-petrik-2 text-stone-100 flex flex-col">
      <div className="box m-1.5 p-1 px-2.5 flex flex-row justify-between">
        <div>
          <span className="font-bold text-lg">PetrikTV</span>
          <span className="text-sm">v1.0</span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="">{clockText[0]}</span>
          <span className="font-bold">{clockText[1]}</span>
        </div>
      </div>

      <div className="mx-1.5 flex-grow grid grid-cols-3 gap-1.5">
        <div className="col-span-1 grid grid-rows-4 gap-1.5">
          <div className="box grid grid-rows-3">
            <BusDeparture />
            <BusDeparture />
            <BusDeparture />
          </div>

          <div className="row-span-2 box">
          </div>

          <div className="box">
          </div>
        </div>

        <div className="col-span-2 box">
        {Substitutions}
        </div>
      </div>

      <div className="m-1.5 p-1 px-2.5 rounded-lg shadow-lg bg-black bg-opacity-30 flex flex-row justify-between">
        <span className="font-bold text-lg">Boldi nigger Bottom bar Huba</span>
      </div>
    </main>
  );
}

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

export default App;
