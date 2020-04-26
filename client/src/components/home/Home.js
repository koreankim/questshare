import React from "react";
import { Row, Col, Card, Divider } from "antd";

class Home extends React.Component {
  displayQuestShareTopic = () => {
    return (
      <Col flex={1} style={{ margin: "5px" }}>
        <Card>
          <strong>What is QuestShare?</strong>
          <div>
            QuestShare is a free UI-friendly lightweight solution for polling
            momentary feedback.
          </div>
          <div>
            It provides meaningful results and automatically filters polls after
            its expiration period.
          </div>
        </Card>
      </Col>
    );
  };

  displayQuestShareUse = () => {
    return (
      <Col flex={1} style={{ margin: "5px" }}>
        <Card>
          <strong>Why should I use it?</strong>
          <div>
            QuestShare provides users with strong security measures to ensure
            your polls are safeguarded from malicious attacks.
          </div>
          <div>
            The creation menu provides selections between unlimited and IP
            specific security options and the ability to enable captcha
            protection to prevent spam.
          </div>
        </Card>
      </Col>
    );
  };

  displayCreatorLinkedin = () => {
    return (
      <Col flex={1} style={{ overflowWrap: "break-word", margin: "5px" }}>
        <Card hoverable title="Linkedin">
          <p>https://www.linkedin.com/in/junhokim97/</p>
        </Card>
      </Col>
    );
  };

  displayImages = () => {
    return (
      <Row>
        <Col flex={1}>
          <Card>
            <img
              src={require("../../assets/answeringform.png")}
              style={{ maxWidth: "100%" }}
              alt="answeringform"
              width="auto"
              height="450"
            />
          </Card>
        </Col>
        <Col flex={1}>
          <Card>
            <img
              src={require("../../assets/results.png")}
              style={{ maxWidth: "100%" }}
              alt="answeringform"
              width="auto"
              height="450"
            />
          </Card>
        </Col>
      </Row>
    );
  };

  displayCreatorGithub = () => {
    return (
      <Col flex={1} style={{ overflowWrap: "break-word", margin: "5px" }}>
        <Card hoverable style={{ width: "fill" }} title="GitHub">
          <p>https://github.com/koreankim</p>
        </Card>
      </Col>
    );
  };

  displayIntroduction = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Row>{this.displayQuestShareTopic()}</Row>
        {this.displayImages()}
        <Row>{this.displayQuestShareUse()}</Row>

        <Card>
          <Divider>About the Creator</Divider>
        </Card>
        <Row>
          {this.displayCreatorLinkedin()}
          {this.displayCreatorGithub()}
        </Row>
      </div>
    );
  };

  render() {
    return this.displayIntroduction();
  }
}

export default Home;
