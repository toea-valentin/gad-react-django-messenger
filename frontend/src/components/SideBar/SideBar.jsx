import { Box, Button, Tab, Tabs, Text } from "grommet";
import { Home } from "grommet-icons";
import React from "react";
import { SelectedUserContext } from "../../contexts/SelectedUserContext";
import { ProfileBar } from "./ProfileBar";
import { UsersList } from "./UsersList";
import { SpaceSeparator } from "./utils";

export const SideBar = () => {
  const { setSelectedUser } = React.useContext(SelectedUserContext);

  return (
    <Box
      direction="column"
      width="300px"
      background="light-1"
      align="center"
      pad="1rem"
      border={{ color: "borderBasic", side: "right" }}
    >
      <ProfileBar />
      <SpaceSeparator />
      <Box
        onClick={() => setSelectedUser(null)}
        align="center"
        justify="center"
        style={{
          cursor: "pointer",
          padding: 10,
          borderRadius: "50%",
          minHeight: "40px",
          maxHeight: "40px",
          maxWidth: "40px",
          minWidth: "40px",
        }}
      >
        <Home />
      </Box>
      <SpaceSeparator />
      <Tabs fill>
        <Tab title="All Users" >
          <div style={{ maxHeight:'100%'}}>
          <UsersList />
          </div>
        </Tab>
        <Tab title="Friends"><Text>Coming soon</Text></Tab>
      </Tabs>
    </Box>
  );
};
