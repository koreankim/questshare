import React from "react";
import { Statistic, Row, Col, Radio, Form, Button } from "antd";
import Error from "../error/Error";
import { sendData } from "../../utils/api/Api";

const { Countdown } = Statistic;

class AnsweringForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      value: 0,
      q_data: props.q_data,
      deadline: props.deadLine,
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

  format_question = () => {
    return (
      <Form.Item label="Question:" required="true">
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
          {options[i]["text"]}
        </Radio>
      );
    }

    return table;
  };

  format_form = () => {
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
    sendData(window.location.pathname + "/choice/" + this.state.value)
      .then(() => {
        this.setState({
          disabled: true,
        });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  onTimerFinish = () => {
    this.setState({
      disabled: true,
    });
  };

  componentDidMount = () => {
    let current = new Date().getTime()
    if (current > this.state.q_data["_disableTime"]["$date"]) {
      this.setState({
        disabled: true
      })
    }
  };

  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <Countdown
              title="Locking form in..."
              value={this.state.q_data["_disableTime"]["$date"]}
              onFinish={this.onTimerFinish}
            />
          </Col>
        </Row>
          <div style={{ marginTop: "15px"}}>{this.format_form()}</div>
      </div>
    );
  }
}

export default AnsweringForm;
