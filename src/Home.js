import React from "react";
import qs from "qs";

const Home = ({ location }) => {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
  console.log(query);

  return <div>Home</div>;
};

export default Home;
