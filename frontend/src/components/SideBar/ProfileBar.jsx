import { Avatar, Box, Button, DropButton, Text } from "grommet";
import { User as UserIcon, Apps as SettingsIcon, Logout } from "grommet-icons";
import React from "react";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";

export const ProfileBar = () => {
  const { loggedUser, setLoggedUser } = React.useContext(LoggedUserContext);

  return (
    <Box
      elevation="xlarge"
      pad="10px"
      fill="horizontal"
      direction="row"
      justify="between"
      align="center"
      round="large"
    >
      <Box direction="row" align="center">
        <Avatar background="brand" size="36px" margin={{ right: "10px" }}>
          <UserIcon />
        </Avatar>
        <Box direction="column">
          <Text size="16px">
            {loggedUser &&
              loggedUser["first_name"] + " " + loggedUser["last_name"]}
          </Text>
          <Text size="11px" color="gray">
            {loggedUser && "@" + loggedUser.username}
          </Text>
        </Box>
      </Box>

      <DropButton
        icon={<SettingsIcon />}
        dropAlign={{ top: "bottom", right: "right" }}
        dropProps={{ round: "small", elevation: "xlarge" }}
        dropContent={
          <Box pad="large" background="white" elevation="xlarge">
            <Button
              primary
              color="#d62121"
              label="Sign out"
              icon={<Logout color="gray" />}
              style={{ color: "gray", background:'white' }}
              onClick={() => setLoggedUser(null)}
            />
          </Box>
        }
      />
    </Box>
  );
};
