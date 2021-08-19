import axios from "axios";
import { Box, Button, TextArea } from "grommet";
import { Send } from "grommet-icons";
import React from "react";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import { SelectedUserContext } from "../../contexts/SelectedUserContext";

export const SendForm = ({ addMessage }) => {
  const { selectedUser } = React.useContext(SelectedUserContext);
  const { loggedUser } = React.useContext(LoggedUserContext);
  const [message, setMessage] = React.useState("");

  const handleSubmit = () => {
    const body = {
      sender: loggedUser.id,
      receiver: selectedUser.id,
      message: message,
      timestamp: "",
      is_read: false,
    };

    if (message) {
      axios
        .post("http://127.0.0.1:8000/api/messages/", body)
        .then((response) => addMessage(response.data));
    }

    setMessage("");
  };

  const handleOnEnter = (event) => {
    if (event.charCode === 13) {
      handleSubmit();
    }
  };

  return (
    <Box pad="10px" direction="row" background="light-1">
      <TextArea
        placeholder="Type a message"
        value={message}
        onKeyPress={handleOnEnter}
        onChange={(event) => setMessage(event.target.value)}
        style={{ background: "white" }}
      />
      <Button margin="10px" onClick={handleSubmit} icon={<Send />} />
    </Box>
  );
};
