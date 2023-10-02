
import { Store } from "lucide-react";
import React from "react";
import type { NextResponse } from 'next/server'
import { error } from "console";
import prismadb from "@/lib/prismadb";


interface DashboardPageProps {
    params: { storeId: string };
};


const Dashboardpage: React.FC<DashboardPageProps> = async ({
    params
}) => {

    const store = await prismadb.store.findFirst({
        where:{
            id: params.storeId
        }
    });
    
    return (
        <div className="p-4">
            Active Store: {store?.name}
        </div>
    );
    
}

export default Dashboardpage;