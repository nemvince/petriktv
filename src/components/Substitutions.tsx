import { useQuery } from "@tanstack/react-query";
import AutoPaginatedTable from "./AutoPaginatedTable";
import { Icon } from "@iconify/react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import periods from "../helpers/periods";

dayjs.extend(customParseFormat);

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
            teacher: item.tname,
            missing: item.helytan,
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

        // TODO: remove entries in the pastP

        // Create a consolidated entry
        return {
          ...group[0],
          lesson: sortedLessons.length > 1
            ? `${sortedLessons[0]}-${sortedLessons[sortedLessons.length - 1]}`
            : sortedLessons[0],
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

      if (!nextPeriod) {
        return [];
      }

      // remove entries in the past
      const consolidatedDataInFuture = consolidatedData.filter((item) => {
        const lessonStart = periods.find((p) => p.period === item.lesson);
        const start = dayjs(lessonStart?.starttime, "HH:mm");
        return now.isBefore(start);
      });

      // Sort the consolidated data by lesson
      return consolidatedDataInFuture.sort((a, b) => {
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
        { icon: <Icon icon="mdi:clock" />, addClasses: "w-12", center: true, key: "lesson" },
        { title: "Tanár", icon: <Icon icon="mdi:account" />, key: "teacher" },
        { title: "Helyettes", icon: <Icon icon="mdi:account-group" />, key: "missing" },
        { title: "Osztály", icon: <Icon icon="mdi:school" />, key: "className" },
        { title: "Terem", icon: <Icon icon="mdi:location" />, key: "classroom" },
        { title: "ÖVH", addClasses: "font-bold text-sm", key: "consolidated", render: (value: boolean) => (value ? <div className="flex justify-center items-center"><Icon icon="mdi:check" /></div> : "") },
      ]}
      emptyStateMessage="Nincs helyettesítés!"
      data={data || []}
      tableHeight={438}
      cycleInterval={5000}
    />
  );
};

export default Substitutions;
