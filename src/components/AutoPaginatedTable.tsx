import { Icon } from "@iconify/react";
import { ReactElement, useEffect, useRef, useState } from "react";

type AutoPaginatedTableProps = {
  cycleInterval?: number;
  tableHeight?: number;
  header: {
    title?: string;
    icon: ReactElement;
    center?: boolean;
    addClasses?: string;
  }[];
  data: {
    lesson: string | number;
    teacher: string;
    missing: string;
    className: string;
    classroom: string;
    consolidated: boolean;
  }[];
};

const AutoPaginatedTable = (props: AutoPaginatedTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(props.data.length);
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const calculateItemsPerPage = () => {
    if (!tableRef.current) return props.data.length;

    const validRowRefs = rowRefs.current.filter((ref) => ref !== null);
    if (validRowRefs.length === 0) return props.data.length;

    const tableHeight = props.tableHeight || 500;
    const headerHeight = 50; // Estimate header height
    const availableHeight = tableHeight - headerHeight;

    let totalHeight = 0;
    let calculatedItemsPerPage = 0;

    for (const row of validRowRefs) {
      if (row) {
        totalHeight += row.offsetHeight;
        if (totalHeight >= availableHeight) break;
        calculatedItemsPerPage++;
      }
    }

    return Math.min(calculatedItemsPerPage, props.data.length); // Ensure no overflow
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const calculatedItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(calculatedItemsPerPage);
    }, 50); // Longer delay to ensure proper rendering

    return () => clearTimeout(timer);
  }, [props.data, props.tableHeight]);

  const totalPages = Math.ceil(props.data.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    return props.data.slice(startIndex, startIndex + itemsPerPage);
  };

  const cyclePages = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
  };

  useEffect(() => {
    if (cycleTimerRef.current) {
      clearInterval(cycleTimerRef.current);
    }

    if (totalPages > 1) {
      cycleTimerRef.current = setInterval(
        cyclePages,
        props.cycleInterval || 3000
      );
    }

    return () => {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
      }
    };
  }, [currentPage, totalPages, props.cycleInterval]);

  return (
    <div className="relative">
      <div
        ref={tableRef}
        className="w-full overflow-hidden"
        style={{
          height: `${props.tableHeight}px`,
          maxHeight: `${props.tableHeight}px`,
        }}
      >
        <table className="w-full h-full">
          <thead>
            <tr className="border-b border-petrik-3">
              {props.header.map((header, index) => (
                <th
                  key={index}
                  className={`px-2 py-1 font-semibold
                    ${header.center ? "text-center" : "text-left"}
                    ${header.addClasses || ""}
                    `}
                >
                  <div className="flex items-center gap-1">
                    {header.icon}
                    {header.title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-auto">
            {getCurrentPageData().map((item, index) => (
              <tr
                key={index}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className={`bg-black ${index % 2 == 0 ? "bg-opacity-10" : "bg-opacity-15"}`}
              >
                <td className="text-left pl-2.5">{item.lesson}.</td>
                <td>{item.teacher}</td>
                <td>{item.missing}</td>
                <td>{item.className}</td>
                <td>{item.classroom}</td>
                <td className="flex justify-center items-center h-full text-emerald-300 text-shadow">
                  {item.consolidated ? <Icon icon="mdi:check" /> : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Page indicator */}
      {totalPages > 1 && (
        <div className="text-center mt-1 font-bold">
          {currentPage + 1}/{totalPages}
        </div>
      )}
    </div>
  );
};

export default AutoPaginatedTable;