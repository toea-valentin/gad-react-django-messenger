import React from "react";
import { Box } from "grommet";

export const SpaceSeparator = () => (
  <Box fill="horizontal" direction="row" margin="10px 0px" />
);

export const Separator = () => (
  <Box
    fill="horizontal"
    direction="row"
    border={{ color: "separator", size: "1px" }}
  />
);
