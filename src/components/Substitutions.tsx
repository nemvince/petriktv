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
  
  type Substitution = {
    lesson: string | number;
    teacher: string;
    missing: string;
    className: string;
    classroom: string;
    consolidated: boolean;
  };
  
  // First, group the data by missing teacher and class name
  const groupedData: Record<string, Substitution[]> = 
    respData.reduce((acc: Record<string, Substitution[]>, item: any) => {
      const key = `${item.tname}-${item.class}`;
      const transformedItem: Substitution = {
        // get first int from lesson string
        lesson: Number(item.ora.split(".")[0].match(/\d+/)[0]),
        teacher: item.helytan,
        missing: item.tname,
        className: item.class,
        classroom: item.terem.split("-")[0],
        consolidated: item.ovh === "1"
      };
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(transformedItem);
      return acc;
    }, {});
  
  // Consolidate entries
  const consolidatedData: Substitution[] = Object.values(groupedData).map(group => {
    // Sort lessons to ensure correct order
    const sortedLessons = group.map(g => g.lesson).sort((a: any, b: any) => a - b);
    
    // Create a consolidated entry
    return {
      ...group[0],
      lesson: sortedLessons.length > 1 
        ? `${sortedLessons[0]}-${sortedLessons[sortedLessons.length - 1]}` 
        : sortedLessons[0],
      consolidated: true
    };
  });
  
  // Sort the consolidated data by lesson
  return consolidatedData.sort((a, b) => {
    // Handle string lessons (consolidated) and number lessons
    const lessonA = typeof a.lesson === 'string' 
      ? parseInt(a.lesson.split('-')[0]) 
      : a.lesson;
    const lessonB = typeof b.lesson === 'string' 
      ? parseInt(b.lesson.split('-')[0]) 
      : b.lesson;
    
    return lessonA - lessonB;
  });
    },
    refetchInterval: 60000,
  })

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  return (
    <AutoPaginatedTable
      header={[
        { icon: <Icon icon="mdi:clock" />, addClasses: "w-12", center: true },
        { title: "Tanár", icon: <Icon icon="mdi:account" /> },
        { title: "Helyettes", icon: <Icon icon="mdi:account-group" /> },
        { title: "Osztály", icon: <Icon icon="mdi:school" /> },
        { title: "Terem", icon: <Icon icon="mdi:location" /> },
        { title: "ÖVH", icon: <Icon icon="material-symbols:merge" /> },
      ]}
      data={data || []}
      tableHeight={410}
      cycleInterval={5000}
    />
  );
};

export default Substitutions;
