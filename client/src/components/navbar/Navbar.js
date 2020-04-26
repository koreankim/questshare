import React from "react";
import "./Navbar.css";
import { withRouter } from "react-router-dom";

import { Menu } from "antd";

class Navbar extends React.Component {
  handleClick(path) {
    this.props.history.push(path);
  }

  render() {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ height: "70pt", textAlign: "center" }}
      >
        <Menu.Item
          style={{ fontSize: "15pt", marginTop: "15pt" }}
          key="1"
          onClick={(e) => this.handleClick("/")}
        >
          Home
        </Menu.Item>
        <Menu.Item
          style={{ fontSize: "15pt", marginTop: "15pt" }}
          key="2"
          onClick={(e) => this.handleClick("/create")}
        >
          Create Question
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(Navbar);
