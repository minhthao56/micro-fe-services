import { useRouteLoaderData } from "react-router-dom";
import type { User } from "firebase/auth";
import { useEffect } from "react";
import {getCustomers} from "../services/booking/customer"

export default function HomePage() {
  const { user } = useRouteLoaderData("root") as { user: User };

  useEffect(() => {
    const getCustomersData = async () => {
      const customers = await getCustomers({limit: 10, offset: 0, search: ""});
      console.log({customers});
    }
    getCustomersData();
  },[])

  if (!user) {
    return <p>You are not logged in.</p>;
  }
  console.log({user});
  return (
    <div className="flex gap-4 items-center">
      <p>Welcome {user.uid}!</p>
    </div>
  );
}
