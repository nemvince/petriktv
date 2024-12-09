import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import hu from "dayjs/locale/hu";
import relativeTime from "dayjs/plugin/relativeTime";
import Substitutions from "./components/Substitutions";
import "./App.css";
import BusDeparture from "./components/BusDeparture";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

dayjs.locale(hu);
dayjs.extend(relativeTime);

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <main className="h-full bg-gradient-to-br from-petrik-1 to-petrik-2 text-stone-100 flex flex-col">
        <div className="box m-1.5 p-1 px-2.5 flex flex-row justify-between">
          <div>
            <span className="font-bold text-lg flex gap-1 items-center">
              <Icon icon="ic:baseline-tv" className="text-2xl" />
              <span>
                PetrikTV
                <span className="text-sm font-light self-end">redux</span>
              </span>
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="">{clockText[0]}</span>
            <span className="font-bold">{clockText[1]}</span>
          </div>
        </div>

        <div className="mx-1.5 flex-grow grid grid-cols-3 gap-1.5">
          <div className="col-span-1 grid grid-rows-4 gap-1.5">
            <div className="box grid grid-rows-3">
              <BusDeparture stopId={"BKK_F01145"} displayName="Keleti felé" />
              <BusDeparture stopId={"BKK_F02716"} displayName="Zugló felé"/>
              <BusDeparture stopId={["BKK_F01149", "BKK_F01146"]} routeFilter={[null, "BKK_0301"]} displayName="Hősök tere felé" />
            </div>

            <div className="row-span-2 box">
            </div>

            <div className="box">
            </div>
          </div>

          <div className="col-span-2 box">
            <Substitutions />
          </div>
        </div>

        <div className="m-1.5 p-1 px-2.5 rounded-lg shadow-lg bg-black bg-opacity-30 flex flex-row justify-between">
          <span className="font-bold text-lg animate-pulse">Bottom text</span>
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
