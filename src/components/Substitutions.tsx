import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import AutoPaginatedTable from "./AutoPaginatedTable";
import { Icon } from "@iconify/react";

const queryClient = new QueryClient();

const Substitutions = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SubstitutionsInternal />
    </QueryClientProvider>
  );
};

const SubstitutionsInternal = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["substitutions"],
    queryFn: async () => {
      const response = await fetch("https://helyettesites.petrik.hu/api/?status=napihely");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const respData = await response.json();
      const data = respData.map((item: any) => ({
        lesson: Number(item.ora.charAt(0)),
        teacher: item.helytan,
        missing: item.tname,
        className: item.class,
        classroom: item.terem,
        consolidated: item.ovh === "1",
      }));
      return data;
    },
    refetchInterval: 60000,
  })

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  return (
    <AutoPaginatedTable
      header={[
        { title: "", icon: <Icon icon="mdi:clock" /> },
        { title: "Tanár", icon: <Icon icon="mdi:account" /> },
        { title: "Helyettes", icon: <Icon icon="mdi:account-group" /> },
        { title: "Osztály", icon: <Icon icon="mdi:school" /> },
        { title: "Terem", icon: <Icon icon="mdi:location" /> },
        { title: "", icon: <Icon icon="material-symbols:merge" /> },
      ]}
      data={data}
      tableHeight={410}
      cycleInterval={5000}
    />
  );
};

export default Substitutions;
