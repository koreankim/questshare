import React from "react";
import "./App.css";
import Navbar from "../navbar/Navbar";
import { appRouter } from "../../utils/router/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router forceRefresh={true}>
        <Navbar />
        {appRouter()}
      </Router>
    );
  }
}

export default App;
