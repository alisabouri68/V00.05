import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { Logout, More } from "iconsax-react";
import AbsMan from "RACT/RACT_absMan";
import { logout } from "RDUX/env/HybSlice";
// import { useNavigate } from "react-router-dom";

import TextIcon from "RCMP/RCMP_iconText";
import Dropdown from "RCMP/RCMP_option_var2";
import Popup from "RCMP/RCMP_popup";
import ButtonGroup from "RCMP/RCMP_buttonGroup";

import logo from "Asset/images/logo.png";
import avatar from "Asset/images/avatar.png";
import {
  DropdownHeader,
  DropdownItem,
  Dropdown as OrigDropdown,
} from "flowbite-react";
import DropdownLarge from "RCMP/RCMP_dropdown_V00.05";

function Header() {
  // const navigate = useNavigate();

  const dispatch = AbsMan.useAppDispatch();

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex justify-between px-5 py-2 bg-white h-14">
      <div className="flex items-center">
        <div className="flex items-center">
          <TextIcon
            logic={{
              text: <img src={logo} />,
            }}
          />
          <TextIcon
            logic={{
              text: "Medical",
              className: "font-bold pl-2",
            }}
          />
        </div>
        <TextIcon
          logic={{
            text: (
              <More
                size={18}
                color="currentColor"
                style={{ transform: "rotate(90deg)", cursor: "pointer" }}
              />
            ),
            className: "pl-3 cursor-pointer",
            // onClick: () => setOpenModal(true),
          }}
        />
      </div>
      <div className="flex gap-6 items-center">
        <Dropdown
          logic={{
            items: [
              {
                id: "Dark",
                label: "Dark",
                icon: () => <FontAwesomeIcon icon={faSun} />,
              },
              {
                id: "Light",
                label: "Light",
                icon: () => <FontAwesomeIcon icon={faSun} />,
              },
            ],
            inline: true,
            label: (
              <>
                <FontAwesomeIcon icon={faSun} />
                <span className="px-2">Theme</span>
              </>
            ),
          }}
        />
<DropdownLarge logic={{options:[
              {
                key: "1",
                label: "English",
                value: "English",
                icon: <FontAwesomeIcon icon={faGlobe} />,
              },
              {
                key: "2",
                label: "Farsi",
                value: "Farsi",
                icon: <FontAwesomeIcon icon={faGlobe} />,
              },
            ],}}
            style={{borderColor:"none"}}
            />


        <div className="flex items-center gap-4">
          <OrigDropdown
            arrowIcon={false}
            inline
            label={
              /* This is the trigger area: Avatar + Name */
              <div className="flex cursor-pointer items-center">
                <TextIcon
                  logic={{
                    text: (
                      <img
                        src={avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    ),
                  }}
                />
                <div className="flex flex-col pl-2 text-left">
                  <TextIcon
                    logic={{
                      text: "Hana Rezaei",
                      className: "font-bold text-gray-900",
                    }}
                  />
                  <TextIcon
                    logic={{
                      text: "(Tehran)",
                      className: "text-sm text-gray-400",
                    }}
                  />
                </div>
              </div>
            }
          >
            <DropdownHeader>
              <span className="block text-sm font-medium">Settings</span>
            </DropdownHeader>

            {/* Logout Item */}
            <DropdownItem
              onClick={() => {
                window?.localStorage?.removeItem("access_token");
                dispatch(logout());
                // navigate("/login");
              }}
            >
              <TextIcon
                logic={{
                  text: "Logout",
                  icon: Logout, // Pass the component directly
                  className: "text-red-600",
                }}
              />
            </DropdownItem>
          </OrigDropdown>
        </div>
      </div>
      <Popup
        logic={{
          header: "List of Service",
          isOpen: openModal,
          onClose: () => setOpenModal(false),
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
    </div>
  );
}

export default Header;
