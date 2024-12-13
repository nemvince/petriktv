import { ReactElement, useEffect, useRef, useState } from "react";
import AnimatedPlaceholder from "./Placeholder";

type HeaderConfig<T> = {
  title?: string;
  icon?: ReactElement;
  center?: boolean;
  addClasses?: string;
  key: keyof T;
  render?: (value: any) => ReactElement | string;
};

type AutoPaginatedTableProps<T> = {
  cycleInterval?: number;
  tableHeight?: number;
  header: HeaderConfig<T>[];
  data: T[];
  emptyStateMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
};

function AutoPaginatedTable<T>(props: AutoPaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(props.data.length);
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const calculateItemsPerPage = () => {
    if (!tableRef.current) {
      console.warn("Table ref not set!");
      return props.data.length;
    }

    const validRowRefs = rowRefs.current.filter((ref) => ref !== null);
    if (validRowRefs.length === 0) {
      console.warn("No valid row refs found!");
      return props.data.length;
    }

    const tableHeight = props.tableHeight || 500;
    const headerHeight = 65;
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

    return Math.min(calculatedItemsPerPage, props.data.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const calculatedItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(calculatedItemsPerPage);
    }, 50);

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

  // Default key extractor if not provided
  const getKey = props.keyExtractor || ((_: T, index: number) => index);

  if (props.data.length === 0) {
    return (
      <div className="h-full w-full justify-center items-center flex flex-col">
        <AnimatedPlaceholder 
          title={props.emptyStateMessage || "No data available!"} 
        />
      </div>
    );
  }

  return (
    <div className="h-full border border-petrik-3 rounded-lg">
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
                  className={`px-2 py-1 font-semibold [&:not(:first-child)]:border-l border-petrik-3
                    ${header.center ? "text-center" : "text-left"}
                    ${header.addClasses || ""}
                    `}
                >
                  <div className="flex items-center justify-center gap-1">
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
                key={getKey(item, index)}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className={`bg-black border-b border-petrik-3 last:border-opacity-80 ${index % 2 == 0 ? "bg-opacity-20" : "bg-opacity-0"}`}
              >
                {props.header.map((header, colIndex) => (
                  <td 
                    key={colIndex}
                    className={`text-center border-l border-petrik-3 
                      ${colIndex === 0 ? 'font-bold border-r' : ''}`}
                  >
                    {header.render 
                      ? header.render(item[header.key]) 
                      : String(item[header.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-2 justify-between mx-4 items-center flex">
          <span className="font-bold">
            {currentPage + 1}/{totalPages}
          </span>
          <span>
            Összesen: {props.data.length}
          </span>
        </div>
      )}
    </div>
  );
}

export default AutoPaginatedTable;