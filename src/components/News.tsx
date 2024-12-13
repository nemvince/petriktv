import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import axios from "axios";
import Marquee from "react-fast-marquee";

const News = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const response = await axios.get(
        "https://helyettesites.petrik.hu/api/",
        {
          params: {
            status: "napihir",
          },
        },
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      // data might be plaintext, so we need to parse it
      if (typeof response.data === "string") {
        return []
      } else {
        return response.data;
      }
      
    },
    refetchInterval: 120000,
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

  return data.length > 0 ? <Marquee className="py-0.5 px-2">{data[0].alert}</Marquee>: null;
};

export default News;
