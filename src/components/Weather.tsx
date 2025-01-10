import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import axios from "axios";

const Weather = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      const location = "Budapest, 1146 BMSZC Petrik";
      const { data } = await axios.get(
        "https://api.weatherapi.com/v1/current.json",
        {
          params: {
            key: import.meta.env.VITE_WEATHER_KEY,
            q: location,
            lang: "hu",
          },
        }
      );

      return data;
    },
    refetchInterval: 600000,
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
    return (
      <div className="h-full flex justify-center items-center gap-3">
        <Icon icon="mdi:alert" className="text-4xl text-red-500" />
        <span>Hiba történt!</span>
      </div>
    );
  }

  return (
    // use iconify
    <div className="h-full flex flex-row justify-between mx-4 items-center p-3">
      <div className="flex justify-center items-center">
        <img src={data.current.condition.icon} className="h-16 w-16" />   
        <span className="self-center text-lg font-bold">{data.current.temp_c} °C</span> 
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex gap-2">
          <Icon icon="mdi:weather-windy" className="text-2xl" />
          <span className="self-center text-lg">
            {data.current.wind_kph} km/h
          </span>
        </div>
        <div className="flex gap-2">
          <Icon icon="mdi:weather-rainy" className="text-2xl" />
          <span className="self-center text-lg">{data.current.precip_mm} mm</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
