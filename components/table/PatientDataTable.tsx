"use client";

import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { decryptKey } from "@/lib/utils";
import { GenderOptions, SkeletonData } from "@/constants";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Filter, FilterX } from "lucide-react";
import { Doctor } from "@/types/appwrite.types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  adminMode?: boolean;
  loading?: boolean;
  doctors?: Doctor[];
}

export function PatientDataTable<TData, TValue>({
  columns,
  data,
  adminMode = true,
  loading = false,
  doctors = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (
      accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString() &&
      adminMode
    ) {
      redirect("/");
    }
  }, [encryptedKey, adminMode]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="data-table">
      {loading ? (
        <div className="flex justify-end gap-4 py-2 pr-2">
          <div className="animate-pulse">
            <div className="h-11 bg-gray-700 w-64"></div>
          </div>

          <div className="animate-pulse">
            <div className="h-11 bg-gray-700 w-10"></div>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-4 py-2 pr-2">
          <Input
            placeholder="Search..."
            type="text"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            className="shad-input border-0 w-64 h-10"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button className="shad-gray-btn h-10">
                {columnFilters?.length > 0 ? (
                  <FilterX className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" sideOffset={10} align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-lg leading-none">Filter</h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Search by email"
                      type="text"
                      value={
                        (table
                          .getColumn("email")
                          ?.getFilterValue() as string) ?? ""
                      }
                      onChange={(event) => {
                        table
                          .getColumn("email")
                          ?.setFilterValue(event.target.value);
                      }}
                      className="shad-input col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      onValueChange={(value) => {
                        table
                          .getColumn("gender")
                          ?.setFilterValue(value as string | "");
                      }}
                      value={
                        (table
                          .getColumn("gender")
                          ?.getFilterValue() as string) || ""
                      }
                    >
                      <SelectTrigger
                        id="gender"
                        className="shad-select-trigger col-span-2 h-8"
                      >
                        <SelectValue placeholder={"Gender"} />
                      </SelectTrigger>

                      <SelectContent className="shad-select-content">
                        {GenderOptions.map((gender) => {
                          return (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select
                      onValueChange={(value) => {
                        table
                          .getColumn("primaryDoctor")
                          ?.setFilterValue(value as string | "");
                      }}
                      value={
                        (table
                          .getColumn("primaryDoctor")
                          ?.getFilterValue() as string) || ""
                      }
                    >
                      <SelectTrigger
                        id="doctor"
                        className="shad-select-trigger col-span-2 h-8"
                      >
                        <SelectValue placeholder={"Doctor"} />
                      </SelectTrigger>

                      <SelectContent className="shad-select-content">
                        {doctors.map((doctor) => {
                          return (
                            <SelectItem key={doctor.$id} value={doctor?.$id}>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={
                                    doctor?.photoUrl ||
                                    "/assets/images/dr-green.png"
                                  }
                                  alt="doctor"
                                  width={100}
                                  height={100}
                                  className="size-4"
                                />
                                <p className="whitespace-nowrap">
                                  Dr. {doctor?.name}
                                </p>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className={"shad-primary-btn w-full"}
                    onClick={() => {
                      table.resetColumnFilters();
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Table className="shad-table">
        <TableHeader className=" bg-dark-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="shad-table-row-header">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading && (
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center p-0"
            >
              {SkeletonData.map((item) => {
                return (
                  <div className="animate-pulse mb-4" key={item}>
                    <div className="h-24 bg-gray-700 w-full"></div>
                  </div>
                );
              })}
            </TableCell>
          )}

          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="shad-table-row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : !loading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="table-actions mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="shad-gray-btn"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow"
          />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="shad-gray-btn"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow "
            className="rotate-180"
          />
        </Button>
      </div>
    </div>
  );
}
