import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize, faCompress } from "@fortawesome/free-solid-svg-icons";
import { HambergerMenu, More, Setting2 } from "iconsax-react";
import BNDL from "BNDL";
import SheetMap from "BNDL/sheetMap";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Spinner,
} from "flowbite-react";
import StickyBox from "react-sticky-box";

import ActionBox from "BOX/BOX_action";
import Auxiliary from "BOX/BOX_auxiliary";
import IconText from "RCMP/RCMP_iconText";
import IconSwitcher from "RCMP/RCMP_iconSwitcher";
import ServicePicker from "RCMP/RCMP_servicePicker";
import JiniSlider from "BOX/RBOX_jini_V00.05/index";

interface SheetEntry {
  component: React.ComponentType<any> | null;
  auxiliary?: React.ComponentType<any> | null;
}

function Main() {
  const navigate = useNavigate();
  const params = useParams();

  // --- States ---
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [groups, setGroups] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // --- Hierarchical Navigation Logic ---
  const activeBundle =
    (BNDL as any[]).find((b) => b.slug === params.bundleName) || BNDL[0];

  const findActiveItems = (bundle: any): [any, any] => {
    const service =
      bundle?.services?.find((s: any) => s.slug === params?.serviceName) ||
      bundle?.services?.[0];
    const sheet: any = params?.sheetName
      ? service?.sheets?.find((sh: any) => sh.slug === params.sheetName)
      : service?.sheets?.[0];

    return [service, sheet];
  };

  const [service, sheet]: any = findActiveItems(activeBundle);

  // --- Loading Logic on Param Change ---
  useEffect(() => {
    setIsLoading(true);
    // Simulate a short delay for smoother transition or wait for data if needed
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [params.bundleName, params.serviceName, params.sheetName]);

  // --- Grouping Logic ---
  useEffect(() => {
    let list: any = {};
    const sortedSheets = [...(service?.sheets ?? [])]?.sort(
      (a: any, b: any) => a?.groupOrder - b?.groupOrder,
    );

    for (const s of sortedSheets) {
      const groupName = s?.group || "Default";
      if (!list[groupName]) list[groupName] = [];
      list[groupName].push(s);
    }

    setGroups(list);
  }, [service?.sheets]);

  const handleBundleChange = (bundleSlug: string) => {
    const targetBundle = (BNDL as any[]).find((b) => b.slug === bundleSlug);
    const firstService = targetBundle?.services?.[0];
    const firstSheet = firstService?.sheets?.[0];
    navigate(`/${bundleSlug}/${firstService.slug}/${firstSheet.slug}`);
  };

  const map = SheetMap as Record<string, SheetEntry>;
  const DynamicComponent = map[sheet?.slug]?.component || null;
  const DynamicAuxiliary = map[sheet?.slug]?.auxiliary || null;

  return (
    <div className="flex gap-2 w-full h-full relative overflow-hidden">
      <div
        className={`transition-all duration-500 ease-in-out relative self-stretch bg-white rounded-xl shadow-md p-3 flex flex-col overflow-y-auto custom-scrollbar min-h-full ${
          showSidebar ? "w-3/4" : "w-full"
        }`}
      >
        <div className={isFullScreen ? "hidden" : "block"}>
          {/* Header Section */}
        <JiniSlider />
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <IconText
                logic={{
                  icon: () => <Setting2 size={17} color="currentColor" />,
                  text: activeBundle?.bundleName,
                  className: "font-bold text-base",
                }}
              />

              <div className="pl-3 mt-1">
                <Dropdown
                  label=""
                  dismissOnClick={true}
                  renderTrigger={() => (
                    <div className="cursor-pointer">
                      <More
                        size={17}
                        color="currentColor"
                        style={{ transform: "rotate(90deg)" }}
                      />
                    </div>
                  )}
                >
                  <DropdownHeader>
                    <span className="block text-xs font-black uppercase text-gray-400">
                      Select Bundle
                    </span>
                  </DropdownHeader>
                  {BNDL.map((bundle: any) => (
                    <DropdownItem
                      key={bundle.slug}
                      onClick={() => handleBundleChange(bundle.slug)}
                      className={
                        bundle.slug === activeBundle.slug
                          ? "bg-blue-50 font-bold"
                          : ""
                      }
                    >
                      {bundle.bundleName}
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>
            </div>

            <div className="flex items-center">
              <IconSwitcher
                logic={{
                  data: [
                    {
                      id: "u1",
                      alt: "U1",
                      placeholderInitials: "U1",
                      rounded: true,
                      color: "success",
                    },
                    {
                      id: "u2",
                      alt: "u2",
                      placeholderInitials: "u2",
                      rounded: true,
                      color: "success",
                    },
                  ],
                }}
              />
              <div className="w-px h-8 bg-gray-200 mx-6" />
              <div className="flex gap-6">
                <div
                  onClick={() => setIsFullScreen(true)}
                  className="cursor-pointer group"
                >
                  <IconText
                    logic={{
                      icon: () => (
                        <FontAwesomeIcon
                          className="group-hover:text-blue-600 transition-colors"
                          icon={faMaximize}
                        />
                      ),
                      text: "Expansion",
                      className: "font-bold group-hover:text-blue-600",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="my-4">
            <ServicePicker
              CANV={activeBundle?.services || []}
              service={service}
              bundleSlug={activeBundle.slug}
            />
          </div>
          <div className="w-full h-px bg-gray-100 mb-4" />

          {/* Sheet Selector */}
          <div className="flex items-center relative">
            <Dropdown
              label=""
              className="z-[99]"
              placement="bottom-start"
              dismissOnClick={true}
              renderTrigger={() => (
                <button className="hover:bg-gray-100 rounded-lg mr-2">
                  <HambergerMenu size={24} color="#374151" />
                </button>
              )}
            >
              <div className="w-64 max-h-[70vh]  py-2">
                {Object.keys(groups).map((groupName) => (
                  <div key={groupName} className="mb-2">
                    <DropdownHeader>
                      <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest">
                        {groupName}
                      </span>
                    </DropdownHeader>
                    {groups[groupName].map((item: any) => (
                      <DropdownItem
                        key={item.slug}
                        onClick={() => {
                          navigate(
                            `/${activeBundle.slug}/${service?.slug}/${item.slug}`,
                          );
                        }}
                        className={`${
                          item.slug === sheet?.slug
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : ""
                        }`}
                      >
                        <span className="text-sm">{item?.sheetName}</span>
                      </DropdownItem>
                    ))}
                  </div>
                ))}
              </div>
            </Dropdown>

            <span className="text-base font-bold text-gray-700 uppercase tracking-tight">
              {sheet?.sheetName}
            </span>
          </div>
        </div>

        {/* Content Area with Loading Overlay */}
        <div
          className={
            isFullScreen
              ? "fixed inset-0 z-[1000] bg-white p-10 flex flex-col"
              : "w-full h-auto relative min-h-screen"
          }
        >
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-[2px] transition-all rounded-xl">
              <Spinner size="xl" aria-label="Loading content" />
            </div>
          )}

          {isFullScreen && (
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {sheet?.sheetName}
                </h2>
                <p className="text-sm text-gray-500">Full Screen Mode</p>
              </div>
              <button
                onClick={() => setIsFullScreen(false)}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl hover:bg-red-100 transition-all border border-red-200"
              >
                <FontAwesomeIcon icon={faCompress} />
                <span className="font-bold">Exit Full Screen</span>
              </button>
            </div>
          )}

          <div
            className={
              isFullScreen
                ? "bg-slate-50 rounded-2xl p-6 shadow-inner min-h-full"
                : ""
            }
          >
            <ActionBox DynamicComponent={DynamicComponent} />
          </div>
        </div>
      </div>

      {/* Auxiliary Sidebar */}
      {!isFullScreen && (
        <StickyBox
          offsetTop={0}
          offsetBottom={0}
          className={`transition-all duration-500 ease-in-out relative flex flex-col self-stretch max-h-screen ${
            showSidebar ? "w-1/4" : "w-0 ml-0"
          }`}
        >
          {/* Toggle Button Container (Kept outside scroll box) */}
          {/* <div
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute top-10 right-0 z-50 bg-blue-600 p-2.5 rounded-l-2xl cursor-pointer hover:bg-blue-700 shadow-lg"
          >
            <Setting2 size={18} color="white" />
          </div> */}

          {/* Inner Card (Always matches screen height) */}
          <div
            className={`w-full h-full bg-white rounded-xl shadow-md transition-opacity duration-300 relative flex flex-col ${
              showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Scrollable Auxiliary Container */}
            <div className="flex-1 overflow-y-auto py-8 custom-scrollbar">
              {isLoading && showSidebar && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
                  <Spinner size="lg" />
                </div>
              )}
              <div className="w-full flex flex-col gap-2 pb-8">
                <Auxiliary DynamicComponent={DynamicAuxiliary} />
              </div>
            </div>
          </div>
        </StickyBox>
      )}
    </div>
  );
}

export default Main;
