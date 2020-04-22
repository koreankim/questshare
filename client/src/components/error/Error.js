import React from "react";
import { Result, Button } from "antd";

class Error extends React.Component {
  handleClick(path) {
    this.props.history.push(path);
  }

  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={(e) => this.handleClick("/")}>Back Home</Button>}
      />
    );
  }
}

export default Error;
