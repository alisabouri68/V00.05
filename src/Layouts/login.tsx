import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginApi as request } from "RACT/RACT_request";
import { toast } from "react-toastify";
import AbsMan from "RACT/RACT_absMan";

import IconText from "RCMP/RCMP_iconText";
import Input from "RCMP/RCMP_input";
import RadioButtin from "RCMP/RCMP_option_var4";
import Button from "RCMP/RCMP_button";

import banner from "Asset/images/banner.png";
import logo from "Asset/images/logo-light.png";
import Box from "RCMP/RCMP_box";

function Login() {
  const isAuth = AbsMan.useAppSelector((state) => state?.hyb?.isAuth);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate("/medical/welcome", { flushSync: true });
  }, [isAuth]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values: any) => {
      const errors: any = {};
      if (!values?.email?.length) errors.email = "Email is required";
      if (!values?.password?.length) errors.password = "Password is required";

      return errors;
    },
    onSubmit: (values: any) => {
      request
        .post("/login", values)
        .then(({ data }) => {
          window?.localStorage?.setItem("access_token", data?.object?.token);
          toast.success(data?.message);
          navigate("/medical/welcome", { flushSync: true });
        })
        .catch((error) => toast.error(error?.response?.data?.message));
    },
  });

  return (
    <div className="flex h-auto w-full">
      <Box
        logic={{
          className: "w-1/2",
          content: (
            <div className="relative text-right">
              <div className="h-screen w-full">
                <IconText
                  logic={{
                    text: <img src={banner} className="h-fit w-full" />,
                  }}
                />
              </div>

              <div className="absolute text-2xl font-bold text-white top-1/3 left-1/3 flex items-center">
                <IconText
                  logic={{
                    icon: () => <img src={logo} className="h-12 mr-3" />,
                  }}
                />

                <div className="flex flex-col items-start">
                  <IconText
                    logic={{
                      text: "Medical",
                    }}
                  />
                  <IconText
                    logic={{
                      text: "MONODASH",
                    }}
                  />
                </div>
              </div>
              <IconText
                logic={{
                  text: "WELCOME TO MONODASH",
                }}
                style={{
                  position: "absolute",
                  "font-size": "1.5rem",
                  "line-height": "2rem",
                  "font-weight": 700,
                  "--tw-text-opacity": 1,
                  color: "rgb(255 255 255 / var(--tw-text-opacity, 1))",
                  top: "50%",
                  left: "50%",
                  "--tw-translate-x": "-50%",
                  transform:
                    "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
                }}
              />
            </div>
          ),
        }}
      />

      <Box
        logic={{
          className: "w-1/2 flex justify-center items-center",
          content: (
            <form
              className="flex flex-col w-2/4"
              onSubmit={formik.handleSubmit}
            >
              <span className="font-bold text-2xl mb-8">Login</span>

              <div className="flex flex-col gap-2">
                <Input
                  logic={{
                    label: "Email",
                    helperText: formik?.errors?.email as string,
                    helperTextColor: formik?.errors?.email ? "failure" : "gray",

                    placeholder: "Enter Your Email ....",
                    type: "email",
                    name: "email",
                    id: "email",
                    value: formik?.values?.email,
                    onChange: formik.handleChange,
                    className: `text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ${
                      formik?.errors?.email
                        ? "border border-red-400 text-gray-900"
                        : "border border-gray-300 text-gray-900"
                    }`,
                  }}
                />

                <Input
                  logic={{
                    label: "password",
                    helperText: formik?.errors?.password as string,
                    helperTextColor: formik?.errors?.password
                      ? "failure"
                      : "gray",
                    placeholder: "Enter Your Password ....",
                    type: "password",
                    name: "password",
                    id: "password",
                    value: formik?.values?.password,
                    onChange: formik.handleChange,
                    className: `text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ${
                      formik?.errors?.password
                        ? "border border-red-400 text-gray-900"
                        : "border border-gray-300 text-gray-900"
                    }`,
                  }}
                />
              </div>

              <IconText
                logic={{
                  text: "Forget Password?",
                }}
                style={{
                  cursor: "pointer",
                  "--tw-text-opacity": 1,
                  color: "rgb(148 163 184 / var(--tw-text-opacity, 1))",
                  "margin-top": "0.25rem",
                  "margin-bottom": "1.5rem",
                  "font-size": "0.875rem",
                  "line-height": "1.25rem",
                }}
              />

              <RadioButtin
                logic={{
                  label: "Remember me?",
                  checked: true,
                  className: "rounded-md",
                }}
              />

              <Button
                logic={{
                  content: "Login",
                  type: "submit",
                  className:
                    "bg-cyan-600 text-white py-4 text-xl rounded-lg cursor-pointer",
                }}
              />
            </form>
          ),
        }}
      />
    </div>
  );
}

export default Login;
