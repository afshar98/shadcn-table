'use client'
import GlobalTable from "@/lib/table"
import { createClm } from "./columns"
import { ApiResponse } from "@/types/api-response.types"

export default function DevicesToAddTable({ data }: { data: ApiResponse }) {
    const columns = createClm()
    return (
      <GlobalTable
        data={data}
        columns={columns}
        pageParamName="devicesToAddedPage"
      />
    )
  }