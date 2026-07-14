import React, { useCallback, useState } from "react";
import { ArrowDown2, Information, ChartSquare } from "iconsax-react";
import { motion, AnimatePresence } from "framer-motion";
import AbsMan from "RACT/RACT_absMan";
import moment from "moment";

// =================================================================
// --- 1. TYPE DEFINITIONS & INTERFACES ---
// =================================================================
interface Gdp {
  _id: string;
  id: string;
  title: string;
  description: string;
  createdBy: {
    name: string;
  };
  updatedAt: string;
  createdAt: string;
  type: string;
  status: string;
  unitSpace: any | null;
  moduleCount: number;
  linkedCount: number;
}

interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * CustomAccordion Component:
 * Manages its own open/close state and provides the specific UI
 * where a line stretches between the title and the arrow.
 */
const CustomAccordion: React.FC<AccordionProps> = ({
  title,
  icon,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      {/* Header Section */}
      <div
        className="flex items-center gap-3 cursor-pointer group py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Icon with subtle background */}
        <div className="flex-shrink-0">{icon}</div>

        {/* Title */}
        <span className="text-[14px] font-bold text-[#001D3D] whitespace-nowrap">
          {title}
        </span>

        {/* The Dynamic Horizontal Line */}
        <div className="flex-grow h-[1px] bg-[#E2E8F0] mx-2"></div>

        {/* Animated Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="text-[#001D3D]"
        >
          <ArrowDown2 size="18" color="currentColor" />
        </motion.div>
      </div>

      {/* Content Section with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-1">
              {" "}
              {/* Aligned with the title text */}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Main Component: GDPDetailView
 */
const Info: React.FC = () => {
  const formattedDate = useCallback((date: string) => {
    return moment(date).format("YYYY-MM-DD HH:mm");
  }, []);

  // Shared style for data labels and values
  const rowStyle = "flex items-center gap-1 py-0.5";
  const labelStyle = "text-[13px] text-gray-700";
  const valueStyle = "text-[13px] text-gray-400";

  return (
    <div className="w-full bg-white select-none px-4">
      {/* 1. Top Header with Blue Accent */}
      <div className="relative pl-4 mb-2">
        <div className="absolute left-0 top-0 h-full w-[3px] bg-[#0077B6] rounded-full"></div>
        <h1 className="text-base font-bold">{"Title"}</h1>
      </div>

      <CustomAccordion
        title="Unit Space Info"
        icon={<Information size="22" color="currentColor" />}
      >
        <div className="space-y-1">
          <div className={rowStyle}>
            <span className={labelStyle}>Id :</span>{" "}
            <span className={valueStyle}>{"unitSpaceId"}</span>
          </div>
          <div className={rowStyle}>
            <span className={labelStyle}>Title :</span>{" "}
            <span className={valueStyle}>{"unitSpaceTitle"}</span>
          </div>
          <div className={rowStyle}>
            <span className={labelStyle}>Status :</span>{" "}
            <span className={valueStyle}>{"unitSpaceStatus"}</span>
          </div>
          <div className={rowStyle}>
            <span className={labelStyle}>Created At :</span>{" "}
            <span className={valueStyle}>
              {formattedDate("2025-07-01")}
            </span>
          </div>
          <div className={rowStyle}>
            <span className={labelStyle}>Updated At :</span>{" "}
            <span className={valueStyle}>
              {formattedDate("2026-07-01")}
            </span>
          </div>
          <div className="mt-4">
            <span className={labelStyle}>Description :</span>
            <p className="text-[12px] text-[#94A3B8] leading-[1.6] mt-1 pr-4 font-light">
              {"unitSpaceDescription"}
            </p>
          </div>
        </div>
      </CustomAccordion>


      {/* 3. Additional Info Accordion */}
      <CustomAccordion
        title="Additional Info"
        icon={<ChartSquare size="20" color="currentColor" />}
      >
        <div className="space-y-1">
          <div className={rowStyle}>
            <span className={labelStyle}>Module Count :</span>{" "}
            <span className={valueStyle}>{10}</span>
          </div>
          <div className={rowStyle}>
            <span className={labelStyle}>Linked Count :</span>{" "}
            <span className={valueStyle}>{5}</span>
          </div>
        </div>
      </CustomAccordion>
    </div>
  );
};

export default Info;
