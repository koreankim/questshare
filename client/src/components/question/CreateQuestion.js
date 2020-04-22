import React from "react";
import { CreateQuestionButton } from "../../modal/questionForm/QuestionForm";

class CreateQuestion extends React.Component {
  render() {
    return (
      <div>
        <div style={{ fontSize: "16px", textAlign: "center" }}>
          <strong>Reminder</strong>: All questions automatically expire after{" "}
          <strong>3</strong> days!
        </div>
        <CreateQuestionButton />
      </div>
    );
  }
}

export default CreateQuestion;
