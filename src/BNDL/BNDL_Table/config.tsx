import {Grid1, Grid2, Grid3, Grid4, Grid5} from "iconsax-react";

export default {
  bundleName: "Table",
  slug: "table",
  color: "bg-pink-100",
  order: 1,
  services: [
    {
      serviceName: "Linear Arrangement",
      slug: "linear-arrangement",
      order: 1,
      color: "bg-pink-100",
      icon: <Grid1  size={21} />,
      sheets: [
        {
          sheetName: "normal",
          slug: "normal",
          order: 1,
          color: "bg-pink-100",
        },
        {
          sheetName: "Agree Bar",
          slug: "agree-bar",
          order:2,
          color: "bg-pink-100",
        }
      ],
    },
    {
      serviceName: "Extended Panel",
      slug: "extended-panel",
      order: 1,
      color: "bg-pink-100",
      icon: <Grid2  size={21} />,
      sheets: [
        {
          sheetName: "Extended Panel",
          slug: "extended-anel",
          order: 1,
          color: "bg-pink-100",
        },
      ],
    },
    {
      serviceName: "Nested Grid",
      slug: "nested-grid",
      order: 1,
      color: "bg-pink-100",
      icon: <Grid3  size={21} />,
      sheets: [
        {
          sheetName: "Nested",
          slug: "nested",
          order: 1,
          color: "bg-pink-100",
        },
      ],
    },
    {
      serviceName: "Member Panel",
      slug: "member-panel",
      order: 1,
      color: "bg-pink-100",
      icon: <Grid4  size={21} />,
      sheets: [
        {
          sheetName: "Member Panel",
          slug: "member-panel",
          order: 1,
          color: "bg-pink-100",
        },
      ],
    },
    {
      serviceName: "Category Arrang",
      slug: "category-arrang",
      order: 1,
      color: "bg-pink-100",
      icon: <Grid5  size={21} />,
      sheets: [
        {
          sheetName: "Category Arrang",
          slug: "category-arrang",
          order: 1,
          color: "bg-pink-100",
        },
      ],
    }
  ],
};
