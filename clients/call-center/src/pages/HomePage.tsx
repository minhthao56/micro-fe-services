import { useRouteLoaderData } from "react-router-dom";
import type { User } from "firebase/auth";

export default function HomePage() {
  const { user } = useRouteLoaderData("root") as { user: User };
  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="flex gap-4 items-center">
      <p>Welcome {user.uid}!</p>
    </div>
  );
}
