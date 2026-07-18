import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "RCMP/RCMP_spinner";

function Action({ DynamicComponent }: any) {
  if (!DynamicComponent) return <Outlet />;
  return (
    <Suspense
      fallback={
        <div className="w-full h-full bg-neutral text-neutral-text flex items-center justify-center">
          <Spinner
            logic={{
              ariaLabel: "Loading ...",
              color: "blue",
              size: "md",
            }}
          />
        </div>
      }
    >
      <DynamicComponent />
    </Suspense>
  );
}

export default Action;
