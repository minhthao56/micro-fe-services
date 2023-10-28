import { NavLink, NavLinkProps } from "react-router-dom";
import { NavbarItem } from "@nextui-org/react";

export interface RouterNavLinkProps extends NavLinkProps {
  children: React.ReactNode;
}

export default function RouterNavLink({
  children,
  ...props
}: RouterNavLinkProps) {
  return (
    <NavLink {...props}>
      {({ isActive }) => (
        <NavbarItem isActive={isActive}>
         {children}
        </NavbarItem>
      )}
    </NavLink>
  );
}
