import { Outlet } from "react-router-dom";
import React from "react";

//defines the layout
const Layout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};
export default Layout;
