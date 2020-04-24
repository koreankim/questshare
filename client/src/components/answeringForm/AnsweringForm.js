import React from "react";
import { Row, Col, Statistic, Radio, Form, Button, Divider } from "antd";
import { sendDataWithOptions } from "../../utils/api/Api";

const { Countdown } = Statistic;

class AnsweringForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      submitting: false,
      value: 0,
    };
  }

  radioStyle = {
    display: "block",
    marginBottom: "15px",
    lineHeight: "30px",
    fontSize: "11pt",
    whiteSpace: "normal",
  };

  format_question = () => {
    return (
      <Form.Item>
        <span className="ant-form-text" style={{ fontSize: "13pt" }}>
          <strong>"{this.props.q_data["_question"]}"</strong>
        </span>
      </Form.Item>
    );
  };

  format_options = () => {
    return (
      <Form.Item
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
    let options = this.props.q_data["_options"];

    for (let i = 0; i < options.length; i++) {
      table.push(
        <Row>
          <Radio
            style={style}
            value={options[i]["choice"]}
            key={options[i]["choice"]}
            disabled={this.state.disabled}
          >
            {options[i]["text"]}
          </Radio>
        </Row>
      );
    }

    return table;
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  onFinish = (values) => {
    this.setState({
      disabled: true,
      submitting: true,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        choice: this.state.value,
        ip: this.props.ip,
        uuid: this.props.uuid,
      }),
    };

    sendDataWithOptions("/questions/submit", requestOptions)
      .then(() => {
        this.setState({
          submitting: false,
        });
      })
      .catch((error) => {
        console.error("There was an error submitting your response!", error);
      });
  };

  onTimerFinish = () => {
    this.setState({
      disabled: true,
    });
    this.props.disableHandler();
  };

  componentDidMount = () => {
    let current = new Date().getTime();
    let didCurrentUserVoteAlready = this.props.q_data["_voters"].includes(
      this.props.ip
    );

    if (
      current > this.props.q_data["_disableTime"]["$date"] ||
      didCurrentUserVoteAlready
    ) {
      this.setState({
        disabled: true,
      });
      this.props.disableHandler();
    } else {
      this.setState({
        disabled: false,
      });
    }
  };

  submitButton = () => {
    return (
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={this.state.disabled}
          loading={this.state.submitting}
        >
          Submit Response
        </Button>
      </Form.Item>
    );
  };

  format_form = () => {
    return (
      <Form
        name="submission_form"
        onFinish={this.onFinish}
      >
        <Row>
          <Col flex={1}>{this.format_question()}</Col>
        </Row>
        <Row style={{ display: "inline-block", textAlign: "left" }}>
          <Col flex={1}>{this.format_options()}</Col>
        </Row>
        {this.submitButton()}
      </Form>
    );
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <Countdown
          title="Locking form in..."
          value={this.props.q_data["_disableTime"]["$date"]}
          onFinish={this.onTimerFinish}
        />
        <Divider/>
        {this.format_form()}
      </div>
    );
  }
}

export default AnsweringForm;
