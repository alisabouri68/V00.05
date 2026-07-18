import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun1, Moon, Global, Logout, More } from "iconsax-react";
import AbsMan from "RACT/RACT_absMan";
import { logout } from "RDUX/env/HybSlice";

import TextIcon from "RCMP/RCMP_iconText";
import Popup from "RCMP/RCMP_popup";
import ButtonGroup from "RCMP/RCMP_buttonGroup";
import DropdownLarge, { IOption } from "RCMP/RCMP_dropdown_V00.05";

import logo from "Asset/images/logo.png";
import avatar from "Asset/images/avatar.png";
import {
  DropdownHeader,
  DropdownItem,
  Dropdown as OrigDropdown,
} from "flowbite-react";
import DropdownLarge from "RCMP/RCMP_dropdown_V00.05";

// ---------- Types ----------

type ThemeValue = "nightwish" | "popcorn";
type LanguageValue = "en" | "fa";

interface HeaderUser {
  name?: string;
  city?: string;
  avatarUrl?: string;
}

interface HeaderProps {
  user?: HeaderUser;
}

// ---------- Static option lists ----------
// نکته: آیکون هر آپشن رو از قبل ثابت گذاشتیم (نه وابسته به state)
// چون IOption.icon فقط یه ReactNode ثابته، نه تابعی که بر اساس isSelected تغییر کنه.

const THEME_OPTIONS: IOption[] = [
  { key: "nightwish", label: "Nightwish", value: "nightwish", icon: <Moon size={21}  className="stroke-gray-900 dark:stroke-gray-300"/> },
  { key: "popcorn", label: "Popcorn", value: "popcorn", icon: <Sun1 size={21}  className="stroke-gray-900 dark:stroke-gray-300"/> },
];

const LANGUAGE_OPTIONS: IOption[] = [
  { key: "en", label: "English", value: "en", icon: <Global size={21} className="stroke-gray-900 dark:stroke-gray-300"/> },
  { key: "fa", label: "Farsi", value: "fa", icon: <Global size={21} className="stroke-gray-900 dark:stroke-gray-300"/> },
];

// ---------- Component ----------

function Header({ user }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = AbsMan.useAppDispatch();

  const [openServicesModal, setOpenServicesModal] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeValue>("popcorn");
  const [language, setLanguage] = useState<LanguageValue>("en");

  useEffect(() => {
    const stored = window?.localStorage?.getItem("theme") as ThemeValue | null;
    const initial = stored ?? "popcorn";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // ✅ ذخیره‌سازی هر تغییر تم در localStorage و اعمال روی DOM
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window?.localStorage?.setItem("theme", theme);
  }, [theme]);
  const handleLanguageChange = (value: LanguageValue): void => {
    setLanguage(value);
    window?.localStorage?.setItem("lang", value);
    // TODO: اگه از react-i18next استفاده می‌کنی: i18n.changeLanguage(value)
  };

  const handleLogout = (): void => {
    window?.localStorage?.removeItem("access_token");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-5 py-2 bg-neutral h-14 text-neutral-text shadow-sm shadow-neutral-ring">
      {/* Left: Logo + Title + Services trigger */}
      <div className="flex items-center">
        <div className="flex items-center">
          <TextIcon logic={{ text: <img src={logo} alt="logo" className="h-8" /> }} />
          <TextIcon logic={{ text: "Medical", className: "font-bold pl-2" }} />
        </div>

        <button
          type="button"
          onClick={() => setOpenServicesModal(true)}
          className="pl-3 cursor-pointer bg-transparent border-0"
          aria-label="More services"
        >
          <More size={18} color="currentColor" style={{ transform: "rotate(90deg)" }} />
        </button>
      </div>

      {/* Right: Theme, Language, Profile */}
      <div className="flex gap-6 items-center">
        <DropdownLarge
          
          logic={{
            options: THEME_OPTIONS,
            value: theme,
            onChange: (value) => setTheme(value as ThemeValue),
            bordered: false,
            searchable: false,
            clearable: false,
            indicatorIcon: "arrow",
          }}
        />

        <DropdownLarge
        
          logic={{
            options: LANGUAGE_OPTIONS,
            value: language,
            onChange: (value) => handleLanguageChange(value as LanguageValue),
            bordered: false,
            searchable: false,
            clearable: false,
            indicatorIcon: "arrow",
          }}
        />

        <OrigDropdown
          arrowIcon={false}
          inline
          label={
            <div className="flex cursor-pointer items-center">
              <img
                src={user?.avatarUrl || avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col pl-2 text-left">
                <span className="font-bold text-gray-900">
                  {user?.name || "Guest"}
                </span>
                <span className="text-sm text-gray-400">
                  {user?.city ? `(${user.city})` : ""}
                </span>
              </div>
            </div>
          }
        >
          <DropdownHeader>
            <span className="block text-sm font-medium">Settings</span>
          </DropdownHeader>

          <DropdownItem onClick={handleLogout}>
            <TextIcon
              logic={{
                text: "Logout",
                icon: Logout,
                className: "text-red-600",
              }}
            />
          </DropdownItem>
        </OrigDropdown>
      </div>

      <Popup
        logic={{
          header: "List of Services",
          isOpen: openServicesModal,
          onClose: () => setOpenServicesModal(false),
          body: (
            <div className="w-full flex justify-center items-center">
              <ButtonGroup
                logic={{
                  buttons: [
                    {
                      id: "Medical",
                      label: "Medical",
                      logic: {},
                      href: `${import.meta.env.VITE_APP_URL}:3000/`,
                      color: "default",
                    },
                  ],
                }}
              />
            </div>
          ),
          footer: null,
        }}
      />
    </header>
  );
}

export default Header;