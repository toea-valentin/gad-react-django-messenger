import axios from "axios";
import { Box } from "grommet";
import React from "react";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import { SelectedUserContext } from "../../contexts/SelectedUserContext";
import { MessagesBody } from "./MessagesBody";
import { SendForm } from "./SendForm";
import { UserBar } from "./UserBar";

export const Chat = () => {
  const { selectedUser } = React.useContext(SelectedUserContext);
  const { loggedUser } = React.useContext(LoggedUserContext);

  const [messages, setMessages] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [connection, setConnection] = React.useState(false);

  const loadMessages = () => {
    const timeOut = setTimeout(() => setLoading(true), 300);
    fetch(
      "http://127.0.0.1:8000/api/messages/" +
        loggedUser.id +
        "/" +
        selectedUser.id
    )
      .then((response) => response.json())
      .then((data) => {
        data.reverse();
        setMessages(data);

        clearTimeout(timeOut);
        setLoading(false);
        setConnection(true);
      });
  };

  const loadNewMessages = () => {
    axios
      .get(
        "http://127.0.0.1:8000/api/messages/" +
          loggedUser.id +
          "/" +
          selectedUser.id
      )
      .then((response) => response.data)
      .then((data) => {
        data.reverse();
        setMessages(data);
      });
  };

  React.useEffect(() => {
    if (selectedUser) {
      setMessages(null);
    }
  }, [selectedUser]);

  React.useEffect(() => {
    if (selectedUser && loggedUser) {
      loadMessages();
    }
  }, [selectedUser, loggedUser]);

  // Check for new messages
  React.useEffect(() => {
    let interval;
    if (connection && selectedUser) {
      interval = setInterval(() => {
        axios
          .get(
            "http://127.0.0.1:8000/api/notification/" +
              loggedUser.id +
              "/" +
              selectedUser.id
          )
          .then((response) => response.data)
          .then((data) => {
            if (data && data.length && data[0]["has_new_message"]) {
              loadNewMessages();
            }
          });
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [connection, selectedUser]);

  const addMessage = (newMessage) => {
    setMessages([newMessage, ...messages]);
  };

  return (
    <Box flex>
      <UserBar selectedUser={selectedUser} />
      <MessagesBody
        messages={messages}
        setMessages={setMessages}
        selectedUser={selectedUser}
        loading={loading}
      />
      <SendForm addMessage={addMessage} />
    </Box>
  );
};
