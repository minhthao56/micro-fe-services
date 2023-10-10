import { Outlet, useFetcher } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Switch,
} from "@nextui-org/react";
import { SunIcon } from "../components/icons/SunIcon";
import { MoonIcon } from "../components/icons/MoonIcon";
import { useThemeSwitcher } from "../hooks/useThemeSwitcher";
export default function PrivateLayout() {
  const { value, onValueChange } = useThemeSwitcher();
  const fetcher = useFetcher();
  const isLoggingOut = fetcher.formData != null;
  return (
    <>
      <>
        <Navbar>
          <NavbarBrand>
            <p className="font-bold text-inherit">CALL CENTER</p>
          </NavbarBrand>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem isActive>
              <Link color="foreground" href="#">
                Drivers
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link color="foreground" href="#">
                Clients
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  <fetcher.Form method="post" action="/logout">
                    <button type="submit" disabled={isLoggingOut}>
                      {isLoggingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </fetcher.Form>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Switch
              isSelected={value}
              size="sm"
              color="secondary"
              startContent={<SunIcon />}
              endContent={<MoonIcon />}
              onValueChange={onValueChange}
            />
          </NavbarContent>
        </Navbar>
      </>
      <Outlet />
    </>
  );
}