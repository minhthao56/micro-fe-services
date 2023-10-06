import { Button } from "@nextui-org/react";
import { useFetcher, useRouteLoaderData } from "react-router-dom";

export default function HomePage() {
  const { user } = useRouteLoaderData("root") as { user: string | null };
  const fetcher = useFetcher();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  const isLoggingOut = fetcher.formData != null;
  return (
    <div className="flex gap-4 items-center">
      <p>Welcome {JSON.stringify(user)}!</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
      <Button size="sm">Small</Button>
    </div>
  );
}
