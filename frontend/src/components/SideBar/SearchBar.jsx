import axios from "axios";
import { Box, TextInput } from "grommet";
import { Search } from "grommet-icons";
import React from "react";

export const SearchBar = ({query, setQuery, setSearchUsers}) => {
  const [timeo, setTimeo] = React.useState(null);

  const handleOnChange = (value) => {
    setQuery(value);

    if (timeo) {
      clearTimeout(timeo);
      setTimeo(null);
    }

    if (value) {
      const currTimeo = setTimeout(() => {
        axios
          .get(
            "http://127.0.0.1:8000/api/search-users/" + value
          )
          .then((response) => response.data)
          .then((data) => {
            console.log(data)
            setSearchUsers(data);
            setTimeo(null);
          });
      }, 700);

      setTimeo(currTimeo);
    }
  };

  return (
    <Box fill="horizontal" direction="row" justify="between" align="center">
      <TextInput
        placeholder="Search for users"
        icon={<Search />}
        value={query}
        onChange={(event) => handleOnChange(event.target.value)}
        style={{background: 'white'}}
      />
    </Box>
  );
};
