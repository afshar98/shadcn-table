"use client";

import { createContext, useContext, useState } from "react";

type SelectedRowsContextType = {
  selectedRowIds: string[];
  setSelectedRowIds: (ids: string[]) => void;
};

const SelectedRowsContext = createContext<SelectedRowsContextType>({
  selectedRowIds: [],
  setSelectedRowIds: () => {},
});

export const useSelectedRows = () => useContext(SelectedRowsContext);

export const SelectedRowsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  return (
    <SelectedRowsContext.Provider
      value={{
        selectedRowIds,
        setSelectedRowIds,
      }}
    >
      {children}
    </SelectedRowsContext.Provider>
  );
};
