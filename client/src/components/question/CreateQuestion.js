import React from "react";
import { Row, Col, Tooltip } from "antd";
import { CreateQuestionButton } from "../../modal/questionForm/QuestionForm";

class CreateQuestion extends React.Component {
  TOOLTIP_MSG =
    "Your question wlil automatically be deleted after 3 days. This means that it will no longer be accessible after this period.";


  displayCreateButton = () => {
    return(
      <div style={{ fontSize: "16px", textAlign: "center" }}>
        <Row>
          <Col flex={1}>
            <Tooltip title={this.TOOLTIP_MSG}>
              <strong>Reminder</strong>: All questions automatically expire
              after <strong>3</strong> days!
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col flex={1}>
            <CreateQuestionButton />
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    return (
      this.displayCreateButton()
    );
  }
}

export default CreateQuestion;
