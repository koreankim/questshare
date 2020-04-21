import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../../components/home/Home"
import CreateQuestion from "../../components/question/CreateQuestion"
import Error from "../../components/error/Error"

export const appRouter = () => {
  return (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/create" component={CreateQuestion} />
    <Route component={Error} />
  </Switch>
  );
};
