/** @jsxImportSource @emotion/react */
import { CSSObject } from "@emotion/serialize";
import {
  HelperText,
  Label,
  TextInput as FlowbiteTextInput,
  type TextInputProps as FlowbiteTextInputProps,
  HelperColors,
} from "flowbite-react";
import { DynamicStringEnumKeysOf } from "flowbite-react/types";
import React from "react";

// The props for our dynamic text input component.
export interface Props extends Omit<
  FlowbiteTextInputProps,
  "children" | "style"
> {
  geometric?: {
    width?: string;
    height?: string;
  };
  logic?: {
    // `logic` is now optional.
    label?: React.ReactNode;
    helperText?: React.ReactNode;
    helperTextColor?: DynamicStringEnumKeysOf<HelperColors>;
    [key: string]: any;
  };
  // The style prop now accepts a standard CSS object for the wrapper.
  style?: CSSObject;
}

const TextInput: React.FC<Props> = ({
  geometric = { width: "100%" },
  // If `logic` isn't provided, our default settings are used.
  logic = {
    label: "Username",
    helperText: "Must be unique and at least 8 characters long.",
    helperTextColor: "gray",
    // ✨  Providing a default ID ensures the `htmlFor` always works.
    id: `default-dynamic-textinput-${Math.random().toString()}`,
  },
  style = {},
}) => {
  const componentCss: CSSObject = {
    width: geometric.width,
    height: geometric.height,
    ...style,
  };

  const { label, helperText, helperTextColor, id, ...others } = logic;

  return (
    <div className="flex flex-col">
      {label && <Label htmlFor={id}>{label}</Label>}
      {/* The input itself no longer needs the dynamic styles. */}
      {/* <FlowbiteTextInput id={id} {...props} css={componentCss} /> */}
      <FlowbiteTextInput id={id} {...others} css={componentCss} />
      {helperText && (
        <HelperText color={helperTextColor as any}>{helperText}</HelperText>
      )}
    </div>
  );
};

export default TextInput;
