import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";





// this route is to target individual store


// update route
export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try 
    {
        const { userId } = auth();

        //extracting the body from the request
        const body = await req.json();

        const { name } = body;


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 } );
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const store = await prismadb.store.updateMany({
            where:{
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    }
    catch (error)
    {
        // api route if error
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}



//Delete route

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try 
    {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 } );
        }

        
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const store = await prismadb.store.deleteMany({
            where:{
                id: params.storeId,
                userId
            }
        });

        return NextResponse.json(store);

    }
    catch (error)
    {
        // api route if error
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

