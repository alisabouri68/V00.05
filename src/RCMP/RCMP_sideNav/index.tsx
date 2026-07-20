import { Element3, Grid1,HambergerMenu,Call} from "iconsax-react";
import { useParams } from "react-router-dom";
import logoDash from "Asset/images/Asset 3.svg";

function SideNav() {
  const { bundleName } = useParams();

  const menuItems = [
    {
      id: "dashboard",
      label: "dashboard",
      icon: Element3,
      active: bundleName === "dashboard",
      link: `/dashboard/default/history`,
    },
    {
      id: "table",
      label: "Table",
      icon: Grid1,
      active: bundleName === "table",
      link: `/table/linear-arrangement/normal`,
    },
    {
      id: "menu",
      label: "Menu",
      icon: HambergerMenu,
      active: bundleName === "menu",
      link: `/menu/service-picker/mono-flat`,
    },
    {
      id: "inter panel calls",
      label: "Inter Panel Calls",
      icon: Call,
      active: bundleName === "inter-panel-calls",
      link: `/inter-panel-calls/environment-checker/environment-checker`,
    },
  ];

  return (
    <aside className="w-16 bg-neutral text-neutral-text rounded-xl flex flex-col items-center py-6 min-h-full select-none shadow-sm shadow-neutral-ring ">
      {/* Logo */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <img src={logoDash} alt="RAAD" className="w-14 h-14 object-contain" />
      </div>

      <div className="w-14 h-0.5 bg-gray-200/70 mb-4" />

      {/* Menu */}
      <nav className="flex flex-col w-full gap-1">
        {menuItems.map(({ id, label, icon: Icon, active, link }) => (
          <a
            key={id}
            href={link}
            className="group relative flex flex-col items-center gap-1.5 py-3 transition-colors duration-300"
          >
            {/* Active left border */}
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] rounded-r-full bg-primary transition-all duration-300 ${
                active
                  ? "h-9 opacity-100 shadow-[0_0_10px_2px_rgba(33,157,188,0.45)]"
                  : "h-0 opacity-0 group-hover:h-5 group-hover:opacity-60"
              }`}
            />

            {/* Icon */}
            <span
              className="flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 "
            >
              <Icon
                size={30}
                className={active ? "stroke-primary" : "stroke-neutral-text"}
                variant={active ? "Bold" : "Linear"}
              />
            </span>

            {/* Label */}
            <span
              className={`text-[10.5px] leading-tight text-center px-1 transition-colors duration-300 ${
                active
                  ? "font-bold text-primary"
                  : "font-medium text-gray-400 group-hover:text-gray-500"
              }`}
            >
              {label}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default SideNav;