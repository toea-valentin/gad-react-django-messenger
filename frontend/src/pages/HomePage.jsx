import { Box } from "grommet";
import React from "react";
import { Chat } from "../components/Chat/Chat";
import { SideBar } from "../components/SideBar/SideBar";
import { SelectedUserContext } from "../contexts/SelectedUserContext";
import logo from "../assets/sunset.gif";

export const HomePage = () => {
  const { selectedUser } = React.useContext(SelectedUserContext);

  return (
    <Box direction="row" fill="vertical">
      <SideBar />
      {selectedUser && <Chat />}
      {!selectedUser && (
        <Box fill flex align="center" justify="center">
          <img
            src={logo}
            alt="loading..."
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      )}
    </Box>
  );
};
