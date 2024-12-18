import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import AutoPaginatedTable from "./AutoPaginatedTable";
type RoomSubstitutionEntry = {
  lesson: number;
  from: string;
  to: string;
  class: string;
};

const RoomSubstitution = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["roomSubstitution"],
    queryFn: async () => {
      const response = await axios.get("https://helyettesites.petrik.hu/api/", {
        params: {
          status: "teremhely",
        },
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const respData = response.data;

      if (respData.length === 0) {
        return [];
      }

      const todaySubs: RoomSubstitutionEntry[] = respData.map((item: any) => {
        return {
          lesson: Number(item.ora.split(".")[0].match(/\d+/)[0]),
          from: item.tname.split("-")[0],
          to: item.terem.split("-")[0],
          class: item.class,
        };
      });

      return Object.values(todaySubs);
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

  return (
    <AutoPaginatedTable
      data={data || []}
      header={[
        {
          icon: <Icon icon="mdi:clock" />,
          addClasses: "w-12",
          center: true,
          key: "lesson",
        },
        {
          title: "Honnan",
          key: "from",
          center: false,
        },
        {
          title: "Hova",
          key: "to",
          center: false,
        },
        {
          title: "Osztály",
          key: "class",
        },
      ]}
      emptyStateMessage="Nincs teremcsere!"
      cycleInterval={5000}
      tableHeight={197}
      headerHeight={10}
    />
  );
};

export default RoomSubstitution;
