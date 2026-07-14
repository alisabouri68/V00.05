import React, { useState } from "react";
// Import Iconsax icons
import {
  Element3,
  Hierarchy,
  Briefcase,
  VoiceSquare,
  Chart2,
} from "iconsax-react";

import TextIcon from "RCMP/RCMP_iconText";
import Separator from "RCMP/RCMP_seperator";
import logoDash from "Asset/images/logo-dash.png";
import { useParams } from "react-router-dom";

function SideNav() {
  const { bundleName } = useParams();

  // Define menu items for cleaner code
  const menuItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: Chart2,
      active: bundleName === "dashboard",
      link: `${import.meta.env.VITE_APP_URL}:3000/dashboard/default/history`,
    },
    {
      id: "Medical",
      label: "Medical",
      icon: Hierarchy,
      active: bundleName === "medical",
      link: `${import.meta.env.VITE_APP_URL}:3000/medical/spk_1/sheet_1`,
    },
  ];

  // Constant colors based on the image
  const activeColor = "#219dbc"; // Blue/Teal color from image
  const inactiveColor = "#292D32"; // Dark gray/black

  return (
    <div className="w-20 bg-white rounded-xl shadow-sm flex flex-col items-center py-4 min-h-full">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <img src={logoDash} alt="AAD Logo" className="object-contain" />
        </div>
        <span className="text-[#409191] font-bold text-lg tracking-widest mt-1">
          RAAD
        </span>
      </div>

      <Separator
        logic={{
          className: "w-10/12 h-[1px] bg-gray-100 mb-8",
        }}
      />

      {/* Navigation Items */}
      <div className="flex flex-col items-center gap-8 w-full">
        {menuItems.map((item) => {
          // const isActive = activeItem === item.id;
          const isActive = item.active;
          const IconComponent = item.icon;

          return (
            <a
              key={item.id}
              className="cursor-pointer transition-all duration-300 hover:opacity-80"
              href={item.link}
            >
              <TextIcon
                logic={{
                  icon: () => (
                    <IconComponent
                      size="32"
                      color={isActive ? activeColor : inactiveColor}
                      // variant={"Linear"} // Optional: change variant when active
                    />
                  ),
                  text: item.label,
                  className: `text-sm font-medium flex-col gap-2 ${
                    isActive ? `text-[${activeColor}]` : "text-gray-800"
                  }`,
                  // Dynamic style for text color
                  style: { color: isActive ? activeColor : inactiveColor },
                }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default SideNav;
