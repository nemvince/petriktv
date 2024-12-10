import { useQuery } from "@tanstack/react-query";
import AutoPaginatedTable from "./AutoPaginatedTable";
import { Icon } from "@iconify/react";
import axios from "axios";
import dayjs from "dayjs";

const periods = [
  {
    period: 0,
    starttime: "7:10",
    endtime: "7:55",
  },
  {
    period: 1,
    starttime: "8:00",
    endtime: "8:45",
  },
  {
    period: 2,
    starttime: "8:55",
    endtime: "9:40",
  },
  {
    period: 3,
    starttime: "9:55",
    endtime: "10:40",
  },
  {
    period: 4,
    starttime: "10:50",
    endtime: "11:35",
  },
  {
    period: 5,
    starttime: "11:45",
    endtime: "12:30",
  },
  {
    period: 6,
    starttime: "12:50",
    endtime: "13:35",
  },
  {
    period: 7,
    starttime: "13:45",
    endtime: "14:30",
  },
  {
    period: 8,
    starttime: "14:35",
    endtime: "15:20",
  },
  {
    period: 9,
    starttime: "15:20",
    endtime: "16:00",
  },
  {
    period: 10,
    starttime: "16:00",
    endtime: "16:40",
  },
  {
    period: 11,
    starttime: "16:45",
    endtime: "17:25",
  },
  {
    period: 12,
    starttime: "17:30",
    endtime: "18:10",
  },
  {
    period: 13,
    starttime: "18:15",
    endtime: "18:55",
  },
  {
    period: 14,
    starttime: "19:00",
    endtime: "19:40",
  },
  {
    period: 15,
    starttime: "19:45",
    endtime: "20:25",
  },
  {
    period: 16,
    starttime: "20:30",
    endtime: "21:10",
  },
];

const Substitutions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["substitutions"],
    queryFn: async () => {
      const response = await axios.get(
        "https://helyettesites.petrik.hu/api/",
        {
          params: {
            status: "napihely",
          },
        },
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const respData = response.data;

      type Substitution = {
        lesson: string | number;
        teacher: string;
        missing: string;
        className: string;
        classroom: string;
        consolidated: boolean;
      };

      // First, group the data by missing teacher and class name
      const groupedData: Record<string, Substitution[]> = respData.reduce(
        (acc: Record<string, Substitution[]>, item: any) => {
          const key = `${item.tname}-${item.class}`;
          const transformedItem: Substitution = {
            // get first int from lesson string
            lesson: Number(item.ora.split(".")[0].match(/\d+/)[0]),
            teacher: item.helytan,
            missing: item.tname,
            className: item.class,
            classroom: item.terem.split("-")[0],
            consolidated: item.ovh === "1",
          };

          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(transformedItem);
          return acc;
        },
        {},
      );

      // Consolidate entries
      const consolidatedData: Substitution[] = Object.values(groupedData).map(
        (group) => {
          // Check if all lessons have the same classroom and teacher
          const sameClassroom = group.every((g) => g.classroom === group[0].classroom);
          const sameTeacher = group.every((g) => g.teacher === group[0].teacher);

          if (sameClassroom && sameTeacher) {
        // Sort lessons to ensure correct order
        const sortedLessons = group.map((g) => g.lesson).sort((
          a: any,
          b: any,
        ) => a - b);

        // TODO: remove entries in the past

        // Create a consolidated entry
        return {
          ...group[0],
          lesson: sortedLessons.length > 1
            ? `${sortedLessons[0]}-${sortedLessons[sortedLessons.length - 1]}`
            : sortedLessons[0],
          consolidated: true,
        };
          } else {
        // If not all lessons have the same classroom and teacher, return the group as is
        return group;
          }
        },
      ).flat();

      // get rid of entries in the past
      const now = dayjs();
      const nextPeriod = periods.find((period) => {
        const start = dayjs(period.starttime, "HH:mm");
        return now.isBefore(start);
      });

      // if (!nextPeriod) {
      //   return [];
      // }

      // Sort the consolidated data by lesson
      return consolidatedData.sort((a, b) => {
        // Handle string lessons (consolidated) and number lessons
        const lessonA = typeof a.lesson === "string"
          ? parseInt(a.lesson.split("-")[0])
          : a.lesson;
        const lessonB = typeof b.lesson === "string"
          ? parseInt(b.lesson.split("-")[0])
          : b.lesson;

        return lessonA - lessonB;
      })
      
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
    <AutoPaginatedTable
      header={[
        { icon: <Icon icon="mdi:clock" />, addClasses: "w-12", center: true },
        { title: "Tanár", icon: <Icon icon="mdi:account" /> },
        { title: "Helyettes", icon: <Icon icon="mdi:account-group" /> },
        { title: "Osztály", icon: <Icon icon="mdi:school" /> },
        { title: "Terem", icon: <Icon icon="mdi:location" /> },
        { title: "ÖVH", addClasses: "font-bold text-sm" },
      ]}
      data={data || []}
      tableHeight={440}
      cycleInterval={5000}
    />
  );
};

export default Substitutions;
