"use client";
import { MAX_SELECTION } from "@/configs/global";
import { useSelectedRows } from "@/provides/selected-devices-row";
import { User } from "@/types/user.types";
import showToast from "@/utils/show-toast";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useEffect, useRef } from "react";

export const createClm = (): ColumnDef<User>[] => {
  const { selectedRowIds, setSelectedRowIds } = useSelectedRows();

  return [
    {
      id: "select",
      header: ({ table }) => {
        useEffect(() => {
          table.getRowModel().rows.forEach((row: Row<User>) => {
            const isSelected = selectedRowIds.includes(row.original.id);
            if (row.getIsSelected() !== isSelected) {
              row.toggleSelected(isSelected);
            }
          });
        }, [table.getRowModel().rows, selectedRowIds]);

        const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
          const isChecked = e.target.checked;
          const rows = table.getRowModel().rows;

          if (isChecked) {
            const availableSlots = Number(MAX_SELECTION) - selectedRowIds.length;
            if (availableSlots <= 0) return;

            const rowsToSelect = rows.slice(0, availableSlots);
            const newSelectedIds = [
              ...selectedRowIds,
              ...rowsToSelect.map((row) => row.original.id),
            ];

            setSelectedRowIds(newSelectedIds);
            if (newSelectedIds.length === Number(MAX_SELECTION)) {
              showToast(
                "warning",
                `You've reached the maximum selection of ${Number(MAX_SELECTION)} users`
              );
            }

            rows.forEach((row, i) => {
              row.toggleSelected(i < availableSlots);
            });
          } else {
            const newSelectedIds = selectedRowIds.filter(
              (id) => !rows.some((row) => row.original.id === id)
            );
            setSelectedRowIds(newSelectedIds);
            table.toggleAllRowsSelected(false);
          }
        };

        const allSelected = table
          .getRowModel()
          .rows.every((row) => selectedRowIds.includes(row.original.id));

        const someSelected = table
          .getRowModel()
          .rows.some((row) => selectedRowIds.includes(row.original.id));

        return (
          <div className="flex justify-center">
            <Checkbox
              checked={allSelected}
              indeterminate={!allSelected && someSelected}
              onChange={handleSelectAll}
              disabled={selectedRowIds.length >= Number(MAX_SELECTION) && !allSelected}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const isSelected = selectedRowIds.includes(row.original.id);
        const isDisabled =
          !isSelected && selectedRowIds.length >= Number(MAX_SELECTION);

        return (
          <div className="flex justify-center">
            <Checkbox
              checked={isSelected}
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked && selectedRowIds.length < Number(MAX_SELECTION)) {
                  const newIds = [...selectedRowIds, row.original.id];
                  setSelectedRowIds(newIds);
                  row.toggleSelected(true);

                  if (newIds.length === Number(MAX_SELECTION)) {
                    showToast(
                      "warning",
                      `You've reached the maximum selection of ${Number(MAX_SELECTION)} users`
                    );
                  }
                } else {
                  setSelectedRowIds(
                    selectedRowIds.filter((id) => id !== row.original.id)
                  );
                  row.toggleSelected(false);
                }
              }}
              disabled={isDisabled}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-center">{row.original.email}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div className="text-center">{row.original.role}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <div className="text-center">{row.original.status}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt).toLocaleDateString();
        return <div className="text-center">{date}</div>;
      },
    },
  ];
};

// Basic reusable checkbox component
const Checkbox = ({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
}: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  disabled?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      checked={checked}
      ref={inputRef}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
