import React from "react";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import QuestionForm from "../questionForm/QuestionForm";

class CreateQuestionButton extends React.Component {
  constructor(props) {
    super(props);
    this.visibilityHandler = this.visibilityHandler.bind(this);
    this.state = {
      visible: false,
    };
  }

  visibilityHandler = (visibility) => {
    this.setState({
      visible: visibility,
    });
  };

  createButton = () => {
    return (
      <div>
        <Button
          style={{ margin: "25px 0px"}}
          type="primary"
          size="large"
          onClick={() => {
            this.visibilityHandler(true);
          }}
        >
          <PlusCircleOutlined />
          New Question
        </Button>
        <QuestionForm
          visible={this.state.visible}
          visibilityHandler={this.visibilityHandler}
        />
      </div>
    );
  };

  render() {
    return this.createButton();
  }
}

export default CreateQuestionButton;
