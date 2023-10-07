import { useRouteLoaderData } from "react-router-dom";

export default function HomePage() {
  const { user } = useRouteLoaderData("root") as { user: string | null };
  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="flex gap-4 items-center">
      <p>Welcome {JSON.stringify(user)}!</p>
    </div>
  );
}
