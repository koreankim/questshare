import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../../components/home/Home"
import CreateQuestion from "../../components/question/CreateQuestion"

export const appRouter = () => {
  return (
  <Switch>
    <Route path="/create" component={CreateQuestion}/>
    <Route path="/" component={Home}/>
  </Switch>
  );
};
