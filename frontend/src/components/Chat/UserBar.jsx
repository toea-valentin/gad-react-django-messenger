import { Avatar, Box } from "grommet";
import React from "react";
import { SelectedUserContext } from "../../contexts/SelectedUserContext";

export const UserBar = ({selectedUser}) => {

  return (
    <Box
      fill="horizontal"
      direction="row"
      align="center"
      justify="between"
      pad="10px"
      background="light-1"
      border={{ color: "borderBasic", side: "bottom" }}
    >
      <Box direction="row" align="center">
        <Avatar background="brand" size="36px" margin={{ right: "10px" }}>
          {selectedUser && selectedUser.username.charAt(0)}
        </Avatar>
        {selectedUser && selectedUser.username}
      </Box>
    </Box>
  );
};
