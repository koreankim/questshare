import React from "react";
import "./Navbar.css";
import { withRouter } from "react-router-dom";

import { Layout, Menu } from "antd";
const { Header } = Layout;

class Navbar extends React.Component {
  handleClick(path) {
    this.props.history.push(path);
  }

  render() {
    return (
      <Header style={{ textAlign: "center" }}>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item
            style={{ color: "#f0f8ff" }}
            key="1"
            onClick={(e) => this.handleClick("/")}
          >
            Home
          </Menu.Item>
          <Menu.Item
            style={{ color: "#f0f8ff" }}
            key="2"
            onClick={(e) => this.handleClick("/create")}
          >
            Create Question
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default withRouter(Navbar);
