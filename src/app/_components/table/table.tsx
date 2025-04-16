"use client";
import GlobalTable from "@/lib/table";
import { createClm } from "./columns";
import { ApiResponse } from "@/types/api-response.types";
import { Suspense, useMemo } from "react";
import { useSelectedRows } from "@/provides/selected-devices-row";

export default function DevicesToAddTable({ data }: { data: ApiResponse }) {
  const { selectedRowIds, setSelectedRowIds } = useSelectedRows();

  const columns = useMemo(
    () => createClm(selectedRowIds, setSelectedRowIds),
    [selectedRowIds, setSelectedRowIds]
  );
  return (
    <div className="w-full max-w-2xl">
      <Suspense fallback={<div>Loading table...</div>}>
        <GlobalTable
          data={data}
          columns={columns}
          pageParamName="devicesToAddedPage"
        />
      </Suspense>
    </div>
  );
}
