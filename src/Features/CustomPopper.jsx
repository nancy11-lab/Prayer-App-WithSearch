import React from "react";
import { Popper } from "@mui/material";

export const CustomPopper = (props) => (
  <Popper
    {...props}
    placement="bottom-start"
    modifiers={[
      { name: "flip", enabled: false }, // يمنع الظهور فوق input
      { name: "preventOverflow", options: { tether: false } },
    ]}
  />
);