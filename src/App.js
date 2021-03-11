import React from "react";
import { Switch, Route } from "react-router-dom";

import Nav from "./Nav";

import Home from "./Home";
import Like from "./Like";
import Product from "./Product";
import NotFound from "./NotFound";

function App() {
  return (
    <div>
      Find My Mask
      <Nav />
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/like" component={Like} />
        <Route path="/product/:companyName/:productName" component={Product} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
