import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";



export default async function SetupLayout ({
    children
}: { children: React.ReactNode; }) 

{
    // recheck for the actively current user
    const { userId } = auth();

    // if not active user
    if(!userId){
        redirect('/sign-in');
    }

    // finding the first active store with the currently login user
    const store = await prismadb.store.findFirst({
        where: {
            userId
        } 
    });

    // if store is active it will redirect to the dashboard
    if(store){
        redirect(`/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    )

}