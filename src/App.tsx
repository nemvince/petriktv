import { useState, useEffect, useRef } from "react";
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import hu from 'dayjs/locale/hu';
import relativeTime from 'dayjs/plugin/relativeTime';
import "./App.css";
import { useOverflow } from "use-overflow";

dayjs.locale(hu);
dayjs.extend(relativeTime);

function App() {
  const [clockText, setClockText] = useState(["", "Betöltés..."]);
  useEffect(() => {
    const interval = setInterval(() => {
      const dateText = dayjs().format('YYYY. MMMM DD. dddd');
      const clockText = dayjs().format('HH:mm:ss');
      setClockText([dateText, clockText]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-full bg-gradient-to-tr from-green-600 text-white to-cyan-600 flex flex-col">
      <div className="m-1.5 p-1 px-2.5 rounded-lg shadow-lg bg-black bg-opacity-40 flex flex-row justify-between">
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
          <div className="rounded-lg shadow-lg bg-black bg-opacity-40 grid grid-rows-3">
            <BusDeparture />
            <BusDeparture />
            <BusDeparture />
          </div>

          <div className="row-span-2 rounded-lg shadow-lg bg-black bg-opacity-40">

          </div>

          <div className="rounded-lg shadow-lg bg-black bg-opacity-40">

          </div>
        </div>

        <div className="col-span-2 rounded-lg shadow-lg bg-black bg-opacity-40">
          <Substitues />
        </div>
      </div>

      <div className="m-1.5 p-1 px-2.5 rounded-lg shadow-lg bg-black bg-opacity-40 flex flex-row justify-between">
        <span className="font-bold text-lg">Bottom bar</span>
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
      const timeLeft = dayjs(departureTime).diff(now, 'minute');
      setTimeLeft(timeLeft > 0 ? `${timeLeft}'` : 'Indul!');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between items-center ml-1 mr-2">
      <div className="flex gap-1">
        <div className="flex gap-1 items-center h-6 bg-cyan-600 pl-1 pr-1.5 rounded-full">
          <Icon icon="mdi:bus" className="text-xl p-0.5 rounded-full bg-white text-cyan-600" />
          <span className="font-bold">123E</span>
        </div>
        <h2 className="self-center">Keleti felé</h2>
      </div>
      <span className="font-bold">{timeLeft}</span>
    </div>
  );
}

const Substitues = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { refYOverflowing, refYScrollBegin, refYScrollEnd } = useOverflow(ref);
  useEffect(() => {
    console.log(refYOverflowing, refYScrollBegin, refYScrollEnd);
  }, [refYOverflowing, refYScrollBegin, refYScrollEnd]);

  const scheduleData = [
    { period: "1", teacher: "Elekesné Sallai Mónika Angéla/Weisz Ilona Mária", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "2", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "3", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "4", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "5", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: true },
    { period: "6", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "7", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "8", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: true },
    { period: "3", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "4", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "5", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: true },
    { period: "5", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: true },
    { period: "6", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "7", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "8", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: true },
    { period: "3", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "4", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "5", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: true },
    { period: "6", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "7", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: false },
    { period: "8", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: true },
    { period: "8", teacher: "Kovács Péter", substitute: "Nagy Béla", class: "9.A", classroom: "101", allClass: true },
  ];
  const [displayData, setDisplayData] = useState(scheduleData);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const displayData = scheduleData.filter(row => {
        const periodStart = dayjs().set('hour', 7).set('minute', 30).add(Number(row.period) - 1, 'hour');
        const periodEnd = periodStart.add(45, 'minute');
        return now.isAfter(periodStart) && now.isBefore(periodEnd);
      });
      setDisplayData(displayData);
    }, 1000);
    return () => clearInterval(interval);
  }, [scheduleData]);


  return (
    <div className="flex flex-col h-full justify-between">
      <div className="container p-2 overflow-y-scroll block max-h-96 no-scrollbar" ref={ref}>
        <table className="min-w-full">
          <thead>
            <tr className="">
              <th className="py-1 px-2 border-b text-left">
                <Icon icon="mdi:clock-time-four-outline" className="text-lg -ml-0.5" />
              </th>
              <th className="py-1 px-2 border-b text-left">
                <span className="flex gap-1 items-center">
                  <Icon icon="mdi:account" className="text-lg -ml-0.5" />
                  Tanár
                </span>
              </th>
              <th className="py-1 px-2 border-b text-left">
                <span className="flex gap-1 items-center">
                  <Icon icon="mdi:account-group" className="text-lg -ml-0.5" />
                  Helyettes
                </span>
              </th>
              <th className="py-1 px-2 border-b text-left">
                <span className="flex gap-1 items-center">
                  <Icon icon="mdi:school" className="text-lg -ml-0.5" />
                  Osztály
                </span>
              </th>
              <th className="py-1 px-2 border-b text-left">
                <span className="flex gap-1 items-center">
                  <Icon icon="mdi:location" className="text-lg -ml-0.5" />
                  Terem
                </span>
              </th>
              <th className="py-1 px-2 border-b text-center">
                <Icon icon="mdi:account-group" className="text-lg -ml-0.5" />
              </th>
            </tr>
          </thead>
          <tbody className="">
            {displayData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "" : ""}>
                <td className="py-1 px-2 border-b">{row.period}.</td>
                <td className="py-1 px-2 border-b">{row.teacher}</td>
                <td className="py-1 px-2 border-b">{row.substitute || "-"}</td>
                <td className="py-1 px-2 border-b">{row.class}</td>
                <td className="py-1 px-2 border-b">{row.classroom}</td>
                <td className="py-1 px-2 border-b text-center">
                  {row.allClass ? (
                    <Icon icon="mdi:check" className="text-green-500 text-lg" />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>

      <div className="flex justify-center pb-2">
        <span className="font-bold">{1}/{2}</span>
      </div>
    </div>
  )
}

export default App;
