import axios from "axios";
import { Box, Button, Spinner, Text } from "grommet";
import { Dislike, Like, Trash } from "grommet-icons";
import React from "react";

const Message = ({ reversed, messageData, deleteMessage, updateMessage }) => {
  const [hover, setHover] = React.useState(false);

  const handleLike = () => {
    const body = {
      message_id: messageData.id,
      sender: messageData.sender,
      receiver: messageData.receiver,
      like_value: messageData.like ? false : true,
    };

    console.log(body);
    axios.post("http://127.0.0.1:8000/api/messages/like", body).then(
      (response) => {
        console.log(response.data);
        updateMessage(messageData.id, body.like_value);
      },
      (error) => console.warn(error)
    );
  };

  return (
    <div>
      <Box
        direction={reversed ? "row-reverse" : "row"}
        fill="horizontal"
        margin={{ top: "12px" }}
      >
        <Box
          direction="column"
          align={reversed ? "end" : "start"}
          width={{ max: "50%" }}
        >
          <Box fill="horizontal" flex align={!reversed ? "end" : "start"}>
            <div style={{ position: "relative", top: 18, left: 10 }}>
              {messageData && messageData.like && (
                <Like
                  color="brand"
                  style={{
                    padding: 5,
                    borderRadius: 10,
                    background: "white",
                    border: "1px solid dodgerblue",
                  }}
                />
              )}
            </div>
          </Box>
          <Box
            direction={reversed ? "row-reverse" : "row"}
            style={{ cursor: "pointer" }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setHover(false);
            }}
          >
            {hover && reversed && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginLeft: "10px",
                  maxHeight: "55px",
                }}
              >
                <Button
                  style={{ padding: "0" }}
                  icon={<Trash size="17px" />}
                  onClick={() => deleteMessage(messageData)}
                />
              </div>
            )}
            {hover && !reversed && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginRight: "10px",
                  maxHeight: "55px",
                }}
              >
                <Button
                  style={{ padding: "0" }}
                  size="small"
                  icon={
                    messageData.like ? (
                      <Dislike size="17px" />
                    ) : (
                      <Like size="17px" />
                    )
                  }
                  onClick={() => handleLike()}
                />
              </div>
            )}
            <Box
              round="medium"
              background="light-2"
              width="fit-content"
              pad="15px"
              justify="center"
              onClick={(e) => {
                e.preventDefault();
                setHover(true);
              }}
            >
              <Text size="small" alignSelf={reversed ? "end" : "start"}>
                {messageData && messageData.message}
              </Text>
            </Box>
          </Box>
          <span
            style={{
              textAlign: "end",
              fontSize: "11px",
              position: "relative",
              bottom: 3,
              right: reversed ? 12 : "auto",
              left: reversed ? "auto" : 12,
              color: "grey",
            }}
          >
            {messageData && messageData.timestamp}
          </span>
        </Box>
      </Box>
    </div>
  );
};

export const MessagesBody = ({
  messages,
  setMessages,
  selectedUser,
  loading,
}) => {
  console.log(messages);

  const deleteMessage = (messageData) => {
    console.log(messageData);
    axios
      .delete(
        "http://127.0.0.1:8000/api/delete-message/" +
          messageData.id +
          "/" +
          messageData.sender +
          "/" +
          messageData.receiver
      )
      .then((response) => console.log("succes"));

    messages = messages.filter((x) => x.id !== messageData.id);
    setMessages([...messages]);
  };

  const updateMessage = (id, value) => {
    setMessages((msg) => {
      const found = msg.find((x) => x.id === id);
      if (found) found.like = value;

      return [...msg];
    });
  };

  return (
    <Box
      fill="horizontal"
      flex
      direction="column-reverse"
      overflow={{ vertical: "scroll" }}
      pad="15px 25px"
    >
      {!loading &&
        messages &&
        messages.map((msg) => (
          <Message
            key={msg.id}
            messageData={msg}
            updateMessage={updateMessage}
            deleteMessage={deleteMessage}
            reversed={!(selectedUser.id === msg.sender)}
          />
        ))}
      {messages && !messages.length && (
        <Text>Start you conversation with this user!</Text>
      )}
      {loading && (
        <Box align="center">
          <Spinner size="medium" />
        </Box>
      )}
    </Box>
  );
};
