import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { loginApi as request } from "RACT/RACT_request";
import AbsMan from "RACT/RACT_absMan";
import { login, logout } from "RDUX/env/HybSlice";

function AuthProvider({ children }: any) {
  const isAuth = AbsMan.useAppSelector((state) => state?.hyb?.isAuth);
  const dispatch = AbsMan.useAppDispatch();

  const navigate = useNavigate();

  const Login = () => {
    dispatch(logout());
    navigate("/login", { flushSync: true });
  };

useEffect(() => {
  if (!isAuth) {
    if (import.meta.env.DEV) {
      dispatch(login({ isAuth: true, user: {} }));
    } else {
      const token = window?.localStorage?.getItem("access_token");

      if (!token?.length) {
        Login();
      } else {
        request
          .get("/verify")
          .then(({ data: { object } }) =>
            dispatch(login({ isAuth: true, user: object }))
          )
          .catch(() => Login());
      }
    }
  }
}, [isAuth]);

  if (!isAuth) return <Outlet />;

  return children;
}

export default AuthProvider;
