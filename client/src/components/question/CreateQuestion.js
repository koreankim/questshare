import React from "react";
import { Row, Col, Tooltip, Card } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import CreateQuestionButton from "../buttons/CreateQuestionButton";

class CreateQuestion extends React.Component {
  TOOLTIP_MSG =
    "Your question wlil automatically be deleted after 24 hours. This means that it will no longer be accessible after this period.";

  displayImages = () => {
    return (
      <Col flex={1}>
        <Card>
          <img
            src={require("../../assets/createpage.png")}
            style={{ maxWidth: "100%" }}
            alt="answeringform"
            width="auto"
            height="450"
          />
        </Card>
      </Col>
    );
  };

  displayImageDescription = () => {
    return (
      <Col flex={1}>
        <Card>
          <p>
            QuestShare is a free-to-use tool. To get started, click on the "New
            Question" button.
          </p>
        </Card>
      </Col>
    );
  };

  displayImageHint = () => {
    return (
      <Col flex={1}>
        <Card>
          <p>
            All questions will automatically be deleted after a day passes from
            its creation. It will be impossible to recover them after this point.
          </p>
        </Card>
      </Col>
    );
  };

  displayCreateButton = () => {
    return (
      <Col flex={1}>
        <Card style={{ margin: "5px" }}>
          <strong>Reminder</strong>: All questions automatically expire after{" "}
          <strong>1</strong> day{" "}
          <Tooltip title={this.TOOLTIP_MSG}>
            <InfoCircleOutlined />
          </Tooltip>
          <CreateQuestionButton />
        </Card>
      </Col>
    );
  };

  display = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Row>{this.displayCreateButton()}</Row>
        <Row>{this.displayImageDescription()}</Row>
        <Row>{this.displayImages()}</Row>
        <Row>{this.displayImageHint()}</Row>
      </div>
    );
  };

  render() {
    return this.display();
  }
}

export default CreateQuestion;
