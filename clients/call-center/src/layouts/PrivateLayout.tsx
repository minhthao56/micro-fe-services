import { Outlet, useFetcher, useRouteLoaderData } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Switch,
} from "@nextui-org/react";
import type { User } from "firebase/auth";
import { SunIcon } from "../components/icons/SunIcon";
import { MoonIcon } from "../components/icons/MoonIcon";
import { useThemeSwitcher } from "../hooks/useThemeSwitcher";
import RouterNavLink from "../components/RouterNavLink";
import { GoHomeFill } from "react-icons/go";
import { FaPhoneVolume } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { commonColors } from "@nextui-org/theme";
import { NotificationPanel } from "../components/NotificationPanel";


export default function PrivateLayout() {
  const { value, onValueChange } = useThemeSwitcher();
  const { user } = useRouteLoaderData("root") as { user: User };
  const fetcher = useFetcher();
  const isLoggingOut = fetcher.formData != null;

  return (
    <>
      <Navbar className="mb-6">
        <NavbarBrand>
          <p className="flex justify-center items-center">
            <FaPhoneVolume />
            <span className="font-bold text-inherit ml-2 text-lg">
              CALL CENTER
            </span>
          </p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <RouterNavLink to="/">
            <IconContext.Provider
              value={{ color: commonColors.blue["500"], size: "1.3rem" }}
            >
              <GoHomeFill />
            </IconContext.Provider>
            <span className="ml-1">Home</span>
          </RouterNavLink>
          <RouterNavLink to="/phone-booking">Phones</RouterNavLink>
          <RouterNavLink to="/customer">Customers</RouterNavLink>
          <RouterNavLink to="/driver">Drivers</RouterNavLink>
          <RouterNavLink to="/booking">Bookings</RouterNavLink>
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          <NotificationPanel/>
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
                <p className="font-semibold">{user.email}</p>
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
            color="primary"
            startContent={<SunIcon />}
            endContent={<MoonIcon />}
            onValueChange={onValueChange}
          />
        </NavbarContent>
      </Navbar>
      <div className="mx-3 flex flex-col items-center">
        <div className="max-w-7xl w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}
