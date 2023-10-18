import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  // checking if there is userId
  if (!userId) {
    redirect("/sign-in");
  }

  // load the store using the Id from the root folder
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    // if store does not exist
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children} {/* from routes/ page.tsx */}
    </>
  );
}
