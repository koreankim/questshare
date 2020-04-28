import React from "react";
import { Row, Col, Statistic, Radio, Form, Button, Divider } from "antd";
import { sendDataWithOptions } from "../../utils/api/Api";
import ReCAPTCHA from "react-google-recaptcha";

const { Countdown } = Statistic;

const CONFIG = require("../../config.json");

class AnsweringForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      submitting: false,
      validated_captcha: false,
      selected_option: false,
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
    const onChange = (e) => {
      this.setState({
        value: e.target.value,
        selected_option: true,
      });
    };

    return (
      <Form.Item
        onChange={onChange}
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

  componentDidMount = () => {
    const current = new Date().getTime();
    const disableTimeReached =
      current > this.props.q_data["_disableTime"]["$date"];
    const userAlreadyVoted = this.props.q_data["_voters"].includes(
      this.props.ip
    );
    const isVotingSecurityEnabled =
      this.props.q_data["_securityType"] !== CONFIG["unlimited_security_type"];

    if (!this.props.q_data["_recaptcha"]) {
      this.setState({
        validated_captcha: true,
      });
    }

    if (disableTimeReached || (isVotingSecurityEnabled && userAlreadyVoted)) {
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
          disabled={
            this.state.disabled ||
            !this.state.validated_captcha ||
            !this.state.selected_option
          }
          loading={this.state.submitting}
        >
          Submit Response
        </Button>
      </Form.Item>
    );
  };

  displayCaptcha = () => {
    const onFinish = (value) => {
      this.setState({
        validated_captcha: true,
      });
    };

    if (this.state.disabled || this.state.validated_captcha) {
      return;
    }

    return (
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
        onChange={onFinish}
      />
    );
  };

  format_form = () => {
    const onFinish = (values) => {
      if (!this.state.validated_captcha) {
        return;
      }

      if (this.props.q_data["_recaptcha"]) {
        this.setState({
          validated_captcha: false,
        });
      }

      const disableForm =
        this.props.q_data["_securityType"] !==
        CONFIG["unlimited_security_type"];

      this.setState({
        disabled: disableForm,
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

    return (
      <Form name="submission_form" onFinish={onFinish}>
        <Row>
          <Col flex={1}>{this.format_question()}</Col>
        </Row>
        <Row style={{ display: "inline-block", textAlign: "left" }}>
          <Col flex={1}>{this.format_options()}</Col>
        </Row>
        <Row>
          <Col flex={1}>{this.submitButton()}</Col>
        </Row>
        <Row>
          <Col flex={55} />
          <Col flex={1}>{this.displayCaptcha()}</Col>
          <Col flex={55} />
        </Row>
      </Form>
    );
  };

  onTimerFinish = () => {
    this.setState({
      disabled: true,
    });
    this.props.disableHandler();
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <Countdown
          title="Locking form in..."
          value={this.props.q_data["_disableTime"]["$date"]}
          onFinish={this.onTimerFinish}
        />
        <Divider />
        {this.format_form()}
      </div>
    );
  }
}

export default AnsweringForm;
