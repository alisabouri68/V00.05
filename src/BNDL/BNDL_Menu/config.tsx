import { Box, HambergerMenu } from "iconsax-react";

export default {
  bundleName: "menu",
  slug: "menu",
  color: "bg-cyan-100",
  order: 1,
  services: [
    {
      serviceName: "Service Picker",
      slug: "spk_1",
      order: 1,
      color: "bg-pink-100",
      icon: <HambergerMenu  size={21} />,
      sheets: [
        {
          sheetName: "Mono Flat",
          slug: "mono-flat",
          order: 1,
          color: "bg-cyan-100",
        },
        {
          sheetName: "Deep Single Subject",
          slug: "deep-single-subject",
          order: 2,
          color: "bg-cyan-100",
        },
        {
          sheetName: "Deep Multi Subject",
          slug: "deep-multi-subject",
          order: 3,
          color: "bg-cyan-300",
        },
        {
          sheetName: "Deep Pro",
          slug: "deep-pro",
          order: 4,
          color: "bg-cyan-400",
        },
      ],
    },
    {
      serviceName: "Sheet Selector",
      slug: "sheet-selector",
      order: 2,
      color: "bg-pink-100",
      icon: <HambergerMenu  size={21} />,
      sheets: [
        {
          sheetName: "Tab Selector",
          slug: "tab-selector",
          order: 1,
          color: "bg-cyan-100",
        },
        {
          sheetName: "Hamberger Selector",
          slug: "hamberger-selector",
          order: 2,
          color: "bg-cyan-200",
        }
      ],
    },
    
    {
      serviceName: "Navigator",
      slug: "navigator",
      order: 3,
      color: "bg-pink-100",
      icon: <HambergerMenu  size={21} />,
      sheets: [
        {
          sheetName: "Navigator",
          slug: "Navigator",
          order: 1,
          color: "bg-cyan-100",
        }
      ],
    },
    
 
  ],
};
