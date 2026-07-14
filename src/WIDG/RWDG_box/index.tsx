/** @jsxImportSource @emotion/react */
import { CSSObject } from "@emotion/react";
import { Badge as FlowbiteBadge, type BadgeProps } from "flowbite-react";
import React from "react";

// The interface for our dynamic badge component.
// We no longer need to Omit `children` because we handle it gracefully.
export interface Props extends Omit<BadgeProps, "style"> {
  geometric?: {
    width?: string;
    height?: string;
  };
  logic?: {
    // This prop provides default content for the badge.
    content?: React.ReactNode;
    [key: string]: any;
  };
  style?: CSSObject;
}

// --- ✨ NEW: Default content for the badge ---
export const defaultLogic = {};

const Box: React.FC<Props> = ({
  geometric = {},
  // If `logic` isn't provided, our default content is used.
  logic = {
    content: "Default",
  },
  style = {},
}) => {
  // Styling logic is simplified for better readability.
  const componentCss: CSSObject = {
    width: geometric.width,
    height: geometric.height,
    ...style,
  };

  const { content, ...others } = logic;

  return (
    // The `css` prop applies our dynamic styles.
    // All other props (`color`, `icon`, `href`, etc.) are passed directly.
    <div {...others} css={componentCss}>
      {content}
    </div>
  );
};

export default Box;
