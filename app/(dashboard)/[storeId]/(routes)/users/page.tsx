import prismadb from "@/lib/prismadb";
import { UserClient } from "./components/client";
import { format } from "date-fns";
import { UserColumn } from "./components/column";

const OrdersPage = async ({ params }: { params: { userId: string } }) => {
  const users = await prismadb.user.findMany({
    where: {
      id: params.userId,
    },
  });

  const formattedOrders: UserColumn[] = users.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
