import { Call } from "iconsax-react";

export default {
  bundleName: "Inter Panel Calls",
  slug: "inter-panel-calls",
  color: "bg-pink-100",
  order: 1,
  services: [
    {
      serviceName: "Environment Checker",
      slug: "environment-checker",
      order: 1,
      color: "bg-pink-100",
      icon: <Call  size={21} />,
      sheets: [
        {
          sheetName: "Environment Checker",
          slug: "environment-checker",
          order: 1,
          color: "bg-pink-100",
        }
      ],
    },
    {
      serviceName: "Environment Maker",
      slug: "environment-maker",
      order: 1,
      color: "bg-pink-100",
      icon: <Call  size={21} />,
      sheets: [
        {
          sheetName: "Environment Maker",
          slug: "environment-maker",
          order: 1,
          color: "bg-pink-100",
        }
      ],
    }
  ],
};
