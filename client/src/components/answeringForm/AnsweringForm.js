import React from "react";
import { Spin, Radio, Form, Button } from "antd";
import Error from "../error/Error";

const CONFIG = require("../../config.json");

class AnsweringForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: props.uuid,
      disabled: false,
      value: 0,
      q_data: {},
      loading: true,
    };
  }

  formItemLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
    fontSize: "11pt",
    whiteSpace: "normal",
  };

  fetchData = () => {
    fetch(CONFIG["proxy"] + "/questions/" + this.props.uuid)
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
          loading: false,
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
          <span className="ant-form-text" style={{ fontSize: "13pt" }}>
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
        rules={[
          {
            required: true,
            message: "Select one of the options before submitting",
          },
        ]}
      >
        <Radio.Group>{this.createRadioOptions(this.radioStyle)}</Radio.Group>
      </Form.Item>
    );
  };

  createRadioOptions = (style) => {
    let table = [];
    let options = this.state.q_data["_options"];

    for (let i = 0; i < options.length; i++) {
      table.push(
        <Radio
          style={style}
          value={options[i]["choice"]}
          key={options[i]["choice"]}
          disabled={this.state.disabled}
        >
          {options[i]["text"]} - <strong>{options[i]["votes"]}</strong>
        </Radio>
      );
    }

    return table;
  };

  format_form = () => {
    if (this.state.loading === true) {
      return <Spin />;
    }
    
    if (
      this.state.q_data == null ||
      Object.entries(this.state.q_data).length === 0
    ) {
      return <Error />;
    }

    return (
      <Form
        name="submission_form"
        {...this.formItemLayout}
        onFinish={this.onFinish}
      >
        {this.format_question()}
        {this.format_options()}
        <Form.Item
          wrapperCol={{ span: 12, offset: 6 }}
          style={{ textAlign: "center" }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.state.disabled}
          >
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
    // TODO: Make into a post call to post ip + choice to ensure IP uniqueness?
    fetch(
      CONFIG["proxy"] + window.location.pathname + "/choice/" + this.state.value
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return data;
      })
      .then(() => {
        this.setState({
          disabled: true,
        });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  componentDidMount = () => {
    this.fetchData()
  };

  render() {
    return <div>{this.format_form()}</div>;
  }
}

export default AnsweringForm;
