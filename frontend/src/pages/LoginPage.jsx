import axios from "axios";
import { Box, Button, FormField, Heading, Text, TextInput } from "grommet";
import React from "react";
import { Link } from "react-router-dom";
import { LoggedUserContext } from "../contexts/LoggedUserContext";

export const LoginPage = () => {
  const { setLoggedUser } = React.useContext(LoggedUserContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = () => {
    const body = {
      username,
      password,
    };
    console.log(body);
    axios.post("http://127.0.0.1:8000/api/login", body).then(
      (response) => {
        console.log(response.data);
        response.data.length && setLoggedUser(response.data[0]);
        !response.data.length && setError("Wrong credentials");
      },
      (error) => setError("Wrong credentials")
    );
  };

  return (
    <Box fill flex align="center" justify="center">
      <Box height="400px" width="250px">
        <Heading margin="10px 0px">Chating App</Heading>
        <Text margin="5px"> Username </Text>
        <TextInput
          placeholder="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Text margin="5px"> Password</Text>
        <TextInput
          placeholder="******"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          margin="20px 0px"
          primary
          label="Login"
          onClick={() => handleSubmit()}
        />
        {error && <Text color="red">{error}</Text>}
        <Link to={"/register"}> Don't have an account? Register here </Link>
      </Box>
    </Box>
  );
};
