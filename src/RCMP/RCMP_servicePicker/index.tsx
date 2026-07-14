import { useNavigate } from "react-router-dom";

function ServicePicker({ CANV, service, bundleSlug }: any) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-row flex-wrap bg-blue-200 p-3 rounded-lg my-3 gap-2 w-full">
        {[...(CANV ?? [])]
          ?.sort((a, b) => a?.order - b?.order)
          ?.map((item) => {
            let className =
              "flex items-center bg-gray-100 w-fit px-5 rounded-lg justify-center text-black p-1 cursor-pointer";
            if (item.serviceName === service?.serviceName)
              className =
                "flex items-center bg-sky-600 w-fit px-5 rounded-lg justify-center text-white p-1 cursor-pointer";
            return (
              <div
                className={className}
                onClick={() => {
                  navigate(
                    `/${bundleSlug}/${item.slug}/${item?.sheets?.[0]?.slug}`,
                    {
                      flushSync: true,
                    },
                  );
                  // setShowMenu(false);
                }}
              >
                <span>{item?.serviceName}</span>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default ServicePicker;
