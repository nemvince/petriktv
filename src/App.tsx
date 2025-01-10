import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import hu from "dayjs/locale/hu";
import relativeTime from "dayjs/plugin/relativeTime";
import Substitutions from "./components/Substitutions";
import "./App.css";
import BusDeparture from "./components/BusDeparture";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import News from "./components/News";
import Weather from "./components/Weather";
import RoomSubstitution from "./components/RoomSubstitution";
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { getVersion } from "@tauri-apps/api/app";

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

  // check for updates every 60 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const update = await check();
      if (update) {
        await update.downloadAndInstall();
        relaunch();
      }
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [appMessage, setAppMessage] = useState("");

  // shortcuts:
  // U: check for updates
  // R: reload the app
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "u") {
        setAppMessage("Checking for updates...");
        check().then(async (update) => {
          if (update) {
            setAppMessage("Update found, downloading...");
            await update.downloadAndInstall();
            relaunch();
          }
          setAppMessage("No updates found.");
          setTimeout(() => setAppMessage(""), 5000);
        });
      } else if (e.key === "r") {
        setAppMessage("Reloading...");
        window.location.reload();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getAppVersion = async () => {
    const version = await getVersion();
    return version;
  }

  const [appVersion, setAppVersion] = useState<string | null>(null);

  useEffect(() => {
    getAppVersion().then(setAppVersion);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="h-full py-2 bg-gradient-to-br from-petrik-1 to-petrik-2 text-stone-100 flex flex-col">
        <div className="box p-1 mx-2 mb-2 px-2.5 flex flex-row justify-between">
          <div>
            <span className="font-bold text-lg flex gap-1 items-center">
              <Icon icon="pepicons-print:television" className="text-2xl" />
              <span>
                PetrikTV
                <span className="text-sm font-light self-end">{appVersion || "redux"}</span>
              </span>
            </span>
          </div>
          <div className="max-w-md flex center items-center">
            <News />
            <span>{appMessage}</span>
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
              <BusDeparture stopId={"BKK_F02716"} displayName="Zugló felé" />
              <BusDeparture
                stopId={["BKK_F01149", "BKK_F01146"]}
                routeFilter={[null, "BKK_0301"]}
                displayName="Hősök tere felé"
              />
            </div>

            <div className="box">
              <Weather />
            </div>

            <div className="row-span-2 box">
              <RoomSubstitution />
            </div>
          </div>

          <div className="col-span-2 row-span-1 box">
            <Substitutions />
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
