import React from "react";
import GtfLogo, { GtfLogoProps } from "./GtfLogo";

export default function GtfWhiteLogo(props: Omit<GtfLogoProps, "variant">) {
  return <GtfLogo variant="white" {...props} />;
}

export { GtfWhiteLogo };

