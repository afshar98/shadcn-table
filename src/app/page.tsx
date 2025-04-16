import { SelectedRowsProvider } from "@/provides/selected-devices-row";
import DevicesToAddTable from "./_components/table/table";
import { ApiResponse } from "@/types/api-response.types";
import { users } from "@/utils/mock-data";

const data: ApiResponse = {
  data: {
    count: 9,
    rows: users,
  },
};

export default function Home() {
  return (
    <div className="">
      <SelectedRowsProvider>
        <DevicesToAddTable data={data} />
      </SelectedRowsProvider>
    </div>
  );
}
