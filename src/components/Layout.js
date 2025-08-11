import { Outlet, useLocation } from "react-router-dom";
import TopNavbar from "./childs/TopNavbar";
import SideBar from "./childs/SideBar";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Stack } from "react-bootstrap";

const Layout = () => {
  const location = useLocation();
  const hideTopNavbarPaths = ["/login", "/register"];
  const hideSidebarPaths = ["/login", "/register"];
  const isTopNavbarHidden = hideTopNavbarPaths.includes(location.pathname);
  const isSidebarHidden = hideSidebarPaths.includes(location.pathname);

  const { user, fetchUser } = useContext(UserContext);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    console.log("users:",user);
  }, [fetchUser]);

  return (
    <>
      {!isTopNavbarHidden && <TopNavbar user={user} />}
      <Stack direction="horizontal" className="h-100">
        {!isSidebarHidden && (
          <Stack className="flex-grow-0 flex-shrink-0">
            <SideBar user={user} />
          </Stack>
        )}
        <Stack className="flex-grow-1 flex-shrink-1">
          <main className="h-100">
            <Outlet />
          </main>
        </Stack>
      </Stack>
    </>
  );
};

export default Layout;
