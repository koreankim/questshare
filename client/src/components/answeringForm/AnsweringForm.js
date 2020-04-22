import React from "react";
import { Radio, Form, Button } from "antd";

const CONFIG = require("../../config.json");

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
  fontSize: "12pt",
};

class AnsweringForm extends React.Component {
  formItemLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      q_data: {},
    };
  }

  componentDidMount = () => {
    const { uuid } = this.props.match.params;

    fetch(CONFIG["proxy"] + "/questions/" + uuid)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        return data;
      })
      .then((data) => {
        this.setState({
          q_data: JSON.parse(data),
        });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  format_question = () => {
    return (
      <Form.Item label="Question:">
        <strong>
          <span className="ant-form-text" style={{ fontSize: "15pt" }}>
            "{this.state.q_data["_question"]}"
          </span>
        </strong>
      </Form.Item>
    );
  };

  format_options = () => {
    return (
      <Form.Item
        name="options"
        label="Options:"
        onChange={this.onChange}
        value={this.state.value}
      >
        <Radio.Group>{this.createRadioOptions(radioStyle)}</Radio.Group>
      </Form.Item>
    );
  };

  format_form = () => {
    if (this.state.q_data == null || Object.entries(this.state.q_data).length === 0) {
      return <div>No question with that identifier exists!</div>;
    }

    return (
      <Form
        name="submission_form"
        {...this.formItemLayout}
        onFinish={this.onFinish}
      >
        {this.format_question()}
        {this.format_options()}
        <Form.Item wrapperCol={{ span: 12, offset: 6 }} style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  createRadioOptions = (style) => {
    let table = [];
    let options = this.state.q_data["_options"];

    for (let i = 0; i < options.length; i++) {
      table.push(
        <Radio style={style} value={i} key={i}>
          {options[i]}
        </Radio>
      );
    }

    return table;
  };

  render() {
    return <div>{this.format_form()}</div>;
  }
}

export default AnsweringForm;
