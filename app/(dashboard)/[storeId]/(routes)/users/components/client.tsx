"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { UserColumn, columns } from "./column";

interface UserClientProps {
  data: UserColumn[];
}

export const UserClient: React.FC<UserClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Users (${data.length})`}
        description="Registered users"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};
