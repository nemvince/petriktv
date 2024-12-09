import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import axios from "axios";
import { components, paths } from "../schema/bkk";
import UpdateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/hu";

dayjs.extend(relativeTime);
dayjs.extend(UpdateLocale);
dayjs.updateLocale("hu", {
  relativeTime: {
    future: "%s",
    past: "Indul!",
    s: "Indul!",
    m: "Indul!",
    mm: "%d'",
    h: "Nincs járat",
    hh: "Nincs járat",
  },
});

interface BusDepartureProps {
  stopId: string | string[];
  routeFilter?: (string | null)[];
  displayName: string;
}

interface DepartureCardProps {
  data: {
    routeShortDesc: string | null;
    predictedDepartureTime: number | null | undefined;
  };
  displayName: string;
}

const BusDeparture = (props: BusDepartureProps) => {
  const getDeparturesForStop = async (stopId: string, routeFilter?: string) => {
    try {
      //   paths["/my/endpoint"]["get"]["responses"][200]["content"]["application/json"]["schema"];
      const response = await axios.get<
        paths["/{dialect}/api/where/arrivals-and-departures-for-stop"]["get"][
          "responses"
        ]["200"]["content"]["application/json"]
      >(
        "https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop",
        {
          params: {
            key: import.meta.env.VITE_BKK_KEY,
            stopId: stopId,
            minutesBefore: 0,
            minutesAfter: 30,
          },
        },
      );

      const body = response
        .data as components["schemas"][
          "ArrivalsAndDeparturesForStopOTPMethodResponse"
        ];

      if (!body.data || !body.data.entry || !body.data.entry.stopTimes) {
        return null;
      }

      let stopTime: components["schemas"]["TransitScheduleStopTime"];
      let routeId: string;
      let routeShortDesc: string;

      if (routeFilter) {
        const trips = body.data?.references?.trips as {
          [key: string]: components["schemas"]["TransitTrip"];
        };
        const filt = Object.values(trips).filter((trip) =>
          trip.routeId === routeFilter
        );

        if (filt.length > 0) {
          const stopTimes = body.data?.entry
            ?.stopTimes as components["schemas"]["TransitScheduleStopTime"][];
          stopTime = stopTimes.filter((stopTime) =>
            filt.map((f) =>
              f.id
            ).includes(stopTime.tripId)
          )[0];
          routeId = routeFilter;
          routeShortDesc =
            (body.data?.references?.routes as {
              [key: string]: { shortName: string };
            })[routeId].shortName;
        } else {
          return null;
        }
      } else {
        stopTime = body.data.entry.stopTimes[0];
        const tripId = stopTime.tripId as string;
        const trip =
          (body.data.references?.trips as {
            [key: string]: components["schemas"]["TransitTrip"];
          })[tripId];
        routeId = trip.routeId as string;
        routeShortDesc =
          (body.data.references?.routes as {
            [key: string]: { shortName: string };
          })[routeId].shortName;
      }

      return {
        routeShortDesc: routeShortDesc,
        predictedDepartureTime: stopTime.predictedDepartureTime ||
          stopTime.departureTime,
      };
    } catch {
      return null;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["busDeparture", props.stopId],
    retry() {
      return false;
    },
    queryFn: async () => {
      if (Array.isArray(props.stopId)) {
        const results = await Promise.all(
          props.stopId.map((stopId, i) =>
            getDeparturesForStop(stopId, props.routeFilter?.[i] ?? "")
          ),
        );
        return results.find((result) => result !== null) || null;
      } else {
        return await getDeparturesForStop(props.stopId);
      }
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center gap-3">
        <Icon icon="mdi:loading" className="text-4xl animate-spin" />
        <span className="animate-pulse">Betöltés...</span>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div className="h-full flex justify-center items-center gap-3">
        <Icon icon="mdi:alert" className="text-4xl text-red-500" />
        <span>Hiba történt!</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex justify-center items-center gap-3">
        <Icon icon="mdi:alert" className="text-4xl text-red-500" />
        <span>Nincs járat!</span>
      </div>
    );
  }

  console.log(data);

  return <DepartureCard data={data} displayName={props.displayName} />;
};

const DepartureCard = (props: DepartureCardProps) => {
  return (
    <div className="flex justify-between items-center mx-2">
      <h2 className="self-center">
        {props.displayName}
      </h2>
      <div className="flex gap-1">
        <span className="font-bold text-sm self-center">
          {props.data.predictedDepartureTime ? dayjs((props.data.predictedDepartureTime || 0) * 1000).fromNow() : "??"}
        </span>
        <div className="flex gap-1 items-center h-6 bg-cyan-600 pl-1 pr-1.5 rounded-full">
          <Icon
            icon="mdi:bus"
            className="text-xl p-0.5 rounded-full bg-white text-cyan-600"
          />
          <span className="font-bold">
            {props.data.routeShortDesc || "???"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusDeparture;
