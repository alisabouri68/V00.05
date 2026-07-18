import { lazy } from "react";
import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import AppLayout from "../AppLayout";
import { ErrorBoundary } from "Layouts/ErrorBoundary";

const Login = lazy(() => import("Layouts/login"));
const Welcome = lazy(() => import("Layouts/welcome"));
const MonoDash = lazy(() => import("Layouts/monoDash"));

const Header = lazy(() => import("BOX/BOX_header"));
const Sidebar = lazy(() => import("BOX/BOX_nav"));

const AuthProvider = lazy(() => import("Providers/authProvider"));

const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <Navigate to={"/medical/welcome"} replace />,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "medical/welcome",
        Component: () => (
          <AuthProvider>
            <ErrorBoundary>
              <Header />
              <Welcome />
            </ErrorBoundary>
          </AuthProvider>
        ),
      },
      {
        path: ":bundleName?/:serviceName?/:sheetName?/:id?",
        Component: () => (
          <AuthProvider>
            <ErrorBoundary>
              <Header />
              <div className="flex p-2 gap-2 w-full min-h-full overflow-hidden" style={{height:"calc(100vh - 56px)"}}>
                <Sidebar />
                <div id="panel" className="flex flex-1 gap-2 min-w-0">
                  <MonoDash />
                </div>
              </div>
            </ErrorBoundary>
          </AuthProvider>
        ),
      },
    ],
  },
];

export default createBrowserRouter(routes);
