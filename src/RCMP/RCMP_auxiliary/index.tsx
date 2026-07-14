import { useRef, useState } from "react";
import { Tabs, TabItem, TabsRef, TabStyles } from "flowbite-react";
import StickyBox from "react-sticky-box";

function Auxiliary(props: {
  tabs: Array<{
    active: boolean;
    disabled: boolean;
    title: string;
    children: any;
  }>;
  style?: keyof TabStyles;
}) {
  const { tabs, style = "underline" } = props;

  const tabsRef = useRef<TabsRef>(null);

  const [_, setActive] = useState<any>(0);

  return (
    <StickyBox offsetTop={0} offsetBottom={0}>
      <Tabs
        ref={tabsRef}
        onActiveTabChange={(activeTab: any) => setActive(activeTab)}
        aria-label="Default tabs"
        variant={style}
        theme={{
          base: "flex flex-col gap-2",
          tablist: {
            base: "flex text-center justify-between",
            variant: {
              underline:
                "w-full -mb-px border-b border-gray-200",
            },
            tabitem: {
              base: "basis-0 flex-1 flex items-center justify-center w-full p-0 py-2 rounded-t-lg text-xs font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 focus:outline-none",
              variant: {
                underline: {
                  base: "rounded-t-lg",
                  active: {
                    on: "text-[#219ebc] rounded-t-lg border-b-2 border-cyan-600 active",
                    off: "border-b-2 border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-600",
                  },
                },
              },
              icon: "mr-2 h-5 w-5",
            },
          },
          tabpanel: "py-3",
        }}
      >
        {tabs?.map((tab) => {
          return (
            <TabItem
              active={tab?.active}
              disabled={tab?.disabled}
              title={tab?.title}
            >
              {/* {
                                active == index
                                    ? tab?.children
                                    : null
                            } */}
              {tab?.children}
            </TabItem>
          );
        })}
      </Tabs>
    </StickyBox>
  );
}

export default Auxiliary;
