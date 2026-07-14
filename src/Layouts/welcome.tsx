import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderMinus,
  faChartSimple,
  faWandMagicSparkles,
  faHeart,
  faSpinner,
  faCheckToSlot,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import BNDL from "BNDL";

import TextIcon from "RCMP/RCMP_iconText";
import Separator from "RCMP/RCMP_seperator";
import Box from "RCMP/RCMP_box";
import Button from "RCMP/RCMP_button";
import Progress from "WIDG/RWDG_progress";

// --- Updated Interfaces based on New Structure ---
interface ServiceSheet {
  sheetName: string;
  slug: string;
  order: number;
  color?: string;
}

interface Service {
  serviceName: string;
  slug: string;
  order: number;
  color: string;
  sheets: ServiceSheet[];
}

interface Bundle {
  bundleName: string;
  slug: string;
  color: string;
  order: number;
  services: Service[];
}

interface HistoryItemType {
  icon: any;
  title: string;
  progress: number;
  date: string;
  user: string;
}

function Welcome() {
  const navigate = useNavigate();

  // Updated navigation logic to include Bundle slug
  const handleServiceClick = (bundleSlug: string, service: Service) => {
    const firstSheetSlug = service.sheets?.[0]?.slug || "";
    // Navigation path updated to include bundle slug
    navigate(
      `/${bundleSlug}/${service.slug}/${firstSheetSlug}`,
      {
        flushSync: true,
      },
    );
  };

  const historyItems: HistoryItemType[] = [
    {
      icon: faChartSimple,
      title: "NTT management",
      progress: 45,
      date: "2020/6/5",
      user: "m.Khodabandelou",
    },
    {
      icon: faWandMagicSparkles,
      title: "NTT management",
      progress: 45,
      date: "2020/6/5",
      user: "m.Khodabandelou",
    },
    {
      icon: faHeart,
      title: "NTT management",
      progress: 45,
      date: "2020/6/5",
      user: "m.Khodabandelou",
    },
    {
      icon: faSpinner,
      title: "NTT management",
      progress: 45,
      date: "2020/6/5",
      user: "m.Khodabandelou",
    },
    {
      icon: faCheckToSlot,
      title: "NTT management",
      progress: 45,
      date: "2020/6/5",
      user: "m.Khodabandelou",
    },
  ];

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-1/2 flex flex-col items-center justify-center gap-6">
        <TextIcon
          logic={{
            text: "WELCOME TO Medical",
            className: "font-bold text-3xl",
          }}
        />
        <Separator
          logic={{
            className: "bg-gray-300 h-1 w-full rounded-full",
          }}
        />
        <TextIcon
          logic={{
            icon: () => (
              <FontAwesomeIcon className="text-6xl" icon={faFolderMinus} />
            ),
          }}
        />
        <TextIcon
          logic={{
            text: "Please select your Service .",
            className: "text-xl font-bold",
          }}
        />
        <TextIcon
          logic={{
            text: "If the desired service is not in the list below, contact support.",
            className: "text-md",
          }}
        />
        <Box
          logic={{
            content: (
              <div className="p-8 gap-6 flex flex-col">
                {/* Map through Bundles */}
                {(BNDL as Bundle[])
                  ?.sort((a, b) => a.order - b.order)
                  ?.map((bundle) => (
                    <div key={bundle.slug} className="flex flex-col gap-2">
                      {/* Bundle Label */}
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {bundle.bundleName}
                      </span>
                      <div className="grid grid-cols-4 gap-3">
                        {/* Map through Services inside Bundle */}
                        {bundle.services
                          ?.sort((a, b) => a.order - b.order)
                          ?.map((service) => (
                            <Button
                              key={service.slug}
                              logic={{
                                onClick: () =>
                                  handleServiceClick(bundle.slug, service),
                                size: "sm",
                                className: `${service.color} text-black hover:text-white transition-colors`,
                                pill: true,
                                content: service.serviceName,
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            ),
            className: "w-full border border-gray-200 bg-gray-200 rounded-xl",
          }}
        />
      </div>

      {/* History Section remains the same */}
      <div className="flex flex-col justify-start w-1/2 pt-8">
        <TextIcon
          logic={{
            text: "Last History",
            className: "font-bold",
          }}
        />
        <div className="flex flex-col pt-5 gap-2">
          {historyItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-row border border-gray-200 p-3 rounded-xl gap-3 items-center"
            >
              <TextIcon
                logic={{
                  icon: () => <FontAwesomeIcon icon={item.icon} />,
                  className:
                    "w-9 h-9 bg-orange-200 rounded-full flex items-center justify-center",
                }}
              />

              <div className="flex flex-col gap-1 flex-1">
                <TextIcon
                  logic={{
                    text: item.title,
                    className: "font-bold text-md",
                  }}
                />
                <div className="w-full h-2 mb-2 bg-gray-200 rounded-full">
                  <Progress
                    logic={{
                      progress: item.progress,
                    }}
                  />
                </div>
              </div>
              <TextIcon
                logic={{
                  text: item.date,
                  className: "px-9",
                }}
              />
              <TextIcon
                logic={{
                  text: item.user,
                  className: "px-9",
                }}
              />
              <TextIcon
                logic={{
                  text: "View",
                  className:
                    "border border-blue-300 rounded-lg py-1 px-2 cursor-pointer",
                  icon: () => <FontAwesomeIcon icon={faEye} />,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
