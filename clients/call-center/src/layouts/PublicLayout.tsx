import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <Outlet />
    </div>
  );
}
