import axios from "axios";
import { Box, Button, Heading, Text, TextInput } from "grommet";
import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export const RegisterPage = () => {
  const history = useHistory();

  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [error, setError] = React.useState("");
  const [succes, setSucces] = React.useState("");

  const handleSubmit = () => {
    const body = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
    };
    console.log(body);
    axios.post("http://127.0.0.1:8000/api/register", body).then(
      (response) => {
        console.log(response.data);
        setSucces(
          " Account created succesfully redirecting to login in 2 seconds!"
        );
        setTimeout(() => {
          history.push("/");
        }, 2000);
      },
      (error) =>
        setError(
          "Username taken or password doesn't contain: 1 uppercase, 1 lowercase, 1 special char, minimum 8 chars"
        )
    );
  };

  return (
    <Box fill flex align="center" justify="center">
      <Box width="250px">
        <Heading margin="10px 0px">Chating App</Heading>
        <Text margin="5px"> Username </Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Text margin="5px"> First Name </Text>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <Text margin="5px"> Last Name </Text>
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
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
          label="Register"
          onClick={() => handleSubmit()}
        />
        {succes && <Text color="green">{succes}</Text>}
        {error && !succes && <Text color="red">{error}</Text>}
        <Link to={"/login"}> Already have an account? Login here</Link>
      </Box>
    </Box>
  );
};
