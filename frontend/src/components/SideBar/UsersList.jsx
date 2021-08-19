import { Avatar, Box, Button, Text, Spinner } from "grommet";
import React from "react";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import { SelectedUserContext } from "../../contexts/SelectedUserContext";
import { SearchBar } from "./SearchBar";
import { Separator, SpaceSeparator } from "./utils";

const UserLine = ({ user }) => {
  return (
    <Box fill="horizontal" direction="row" align="center" pad="7px">
      <Avatar background="brand" size="36px" margin={{ right: "10px" }}>
        {user && user.username.charAt(0)}
      </Avatar>
      <Box direction="column">
        <Text size="small">
          {user && user["first_name"] + " " + user["last_name"]}
        </Text>
        <Text size="11px" color="gray">
          {user && "@" + user.username}
        </Text>
      </Box>
    </Box>
  );
};

export const UsersList = () => {
  const [users, setUsers] = React.useState(null);
  const [searchUsers, setSearchUsers] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [newUsersCheck, setNewUsersCheck] = React.useState(null);

  const { selectedUser, setSelectedUser } =
    React.useContext(SelectedUserContext);

  const { loggedUser } = React.useContext(LoggedUserContext);

  React.useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users/" + loggedUser.id)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setNewUsersCheck(true);
      });
  }, [loggedUser]);

  React.useEffect(() => {
    if (!query) setSearchUsers(null);
  }, [query]);

  /*
  React.useEffect(() => {
    let timeOut = null;

    if (newUsersCheck !== null) {
      let id = users[users.length - 1].id;

      const lookForUsers = () => {
        fetch("http://127.0.0.1:8000/api/newusers/" + id)
          .then((response) => response.json())
          .then((data) => {
            data && data.length && setUsers((u) => [...u, ...data]);
            setNewUsersCheck(!newUsersCheck);
          });
      };

      timeOut = setTimeout(lookForUsers, 2000);
    }

    if (!timeOut) return;

    return () => clearTimeout(timeOut);
  }, [newUsersCheck, users]);*/

  return (
    <>
      <div style={{ position: "sticky", top: 10 }}>
        <SpaceSeparator />
        <SearchBar
          query={query}
          setQuery={setQuery}
          setSearchUsers={setSearchUsers}
        />
      </div>
      <SpaceSeparator />
      <div
        style={{
          maxHeight: "58vh",
          display: "flex",
          overflowY: "scroll",
          flexDirection: "column",
        }}
      >
        <Box direction="column" overflow={{ vertical: "scroll" }}>
          {users &&
            !searchUsers &&
            users.map((user) => (
              <Button
                active={
                  selectedUser && user.id === selectedUser.id ? true : false
                }
                as="div"
                key={user.id}
                onClick={() => setSelectedUser(user)}
              >
                <UserLine user={user} />
                <Separator />
              </Button>
            ))}
          {searchUsers &&
            searchUsers.map((user) => (
              <Button
                active={
                  selectedUser && user.id === selectedUser.id ? true : false
                }
                as="div"
                key={user.id}
                onClick={() => setSelectedUser(user)}
              >
                <UserLine user={user} />
                <Separator />
              </Button>
            ))}
          {searchUsers && !searchUsers.length && <Text> No users found </Text>}
        </Box>
      </div>
    </>
  );
};
