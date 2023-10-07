import {
  Form,
  useActionData,
  useLocation,
  useNavigation,
} from "react-router-dom";
import Email from "../components/inputs/Email";
import Password from "../components/inputs/Password";
import { Button } from "@nextui-org/react";

export default function LoginPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from") || "/";

  const navigation = useNavigation();
  const isLoggingIn = navigation.formData?.get("email") != null;

  const actionData = useActionData() as { error: string } | undefined;

  return (
    <div>
      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={from} />
        <Email />
        <Password />
        <Button type="submit" disabled={isLoggingIn} size="md">
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}
