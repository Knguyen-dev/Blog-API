import { Outlet } from "react-router-dom";

/**
 * Layout component that acts as the root. So all of the other route elements are put
 * under this component.
 */
export default function RootLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
