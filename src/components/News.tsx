import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import axios from "axios";

const News = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["substitutions"],
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

      const respData = response.data;

      if (respData === "empty") {
        return [];
      }

      return respData;
      
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
    return (
      <div className="h-full flex justify-center items-center gap-3">
        <Icon icon="mdi:alert" className="text-4xl text-red-500" />
        <span>Hiba történt!</span>
      </div>
    );
  }

  return (
    <span className="font-bold text-lg">
      {data.length > 0 ? data[0].alert : "Nincs hír"}
    </span>
  );
};

export default News;
