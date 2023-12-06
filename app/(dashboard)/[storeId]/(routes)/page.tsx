import { CreditCardIcon, DollarSign, Package } from "lucide-react";
import React from "react";
import type { NextResponse } from "next/server";
import { error } from "console";
import prismadb from "@/lib/prismadb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatter } from "@/lib/utils";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStocks } from "@/actions/get-stocks";
import { Overview } from "@/components/overview";
import { getGraphRevenue } from "@/actions/get-graph-revenue";

interface DashboardPageProps {
  params: { storeId: string };
}

const Dashboardpage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStocks(params.storeId);
  const graphrevenue = await getGraphRevenue(params.storeId);

  // const

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title={"Sales"} description={"Sales over view"} />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card className=" border-green-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-7 w-7 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                {" "}
                Total Sales{" "}
              </CardTitle>
              <CreditCardIcon className="h-7 w-7 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {" "}
                {salesCount === 1
                  ? `+ ${salesCount} Item`
                  : `+ ${salesCount} Items`}{" "}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                {" "}
                Products in Stock :{" "}
              </CardTitle>
              <Package className="h-7 w-7 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {stockCount} </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-center"> Chart Overview </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphrevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboardpage;
