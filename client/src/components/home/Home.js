import React from "react";
import { Row, Col } from "antd";

class Home extends React.Component {
  displayIntroduction = () => {
    return (
      <div>
        <Row>
          <Col flex={1}>
            <strong>What is QuestShare?</strong>
            <div>
              QuestShare is a UI-friendly lightweight solution for polling
              momentary feedback.
            </div>
            <div>
              It provides meaningful results and automatically filters polls
              after its expiration period.
            </div>
          </Col>
        </Row>
        <Row>
          <Col flex={1}>
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
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return this.displayIntroduction();
  }
}

export default Home;
