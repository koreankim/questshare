import React from "react";
import { Statistic, Radio, Form, Button, Divider } from "antd";
import Error from "../error/Error";
import { sendDataWithOptions, fetchIP } from "../../utils/api/Api";

const { Countdown } = Statistic;

class AnsweringForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      ip: 0,
      value: 0,
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
    lineHeight: "30px",
    fontSize: "11pt",
    whiteSpace: "normal",
  };

  format_question = () => {
    return (
      <Form.Item
        label={
          <strong>
            <span style={{ fontSize: "13pt" }}>Question</span>
          </strong>
        }
        required="true"
      >
        <span className="ant-form-text" style={{ fontSize: "13pt" }}>
          "{this.props.q_data["_question"]}"
        </span>
      </Form.Item>
    );
  };

  format_options = () => {
    return (
      <Form.Item
        name="options"
        label={
          <strong>
            <span style={{ fontSize: "13pt" }}>Option(s)</span>
          </strong>
        }
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
      this.props.q_data == null ||
      Object.entries(this.props.q_data).length === 0
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
    this.setState({
      disabled: true,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        choice: this.state.value,
        ip: this.state.ip,
        uuid: this.props.uuid,
      }),
    };

    sendDataWithOptions("/questions/submit", requestOptions)
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
    let didCurrentUserVoteAlready = false;

    fetchIP().then((data) => {
      this.setState({
        ip: data
      })

      if (this.props.q_data["_voters"].includes(this.state.ip)) {
        didCurrentUserVoteAlready = true;
      }

      if (current > this.props.q_data["_disableTime"]["$date"] || didCurrentUserVoteAlready) {
        this.setState({
          disabled: true,
        });
        this.props.disableHandler();
      }
      else {
        this.setState({
          disabled: false
        })
      }
    });
  };

  render() {
    return (
      <div>
        <Countdown
          title="Locking form in..."
          value={this.props.q_data["_disableTime"]["$date"]}
          onFinish={this.onTimerFinish}
        />
        <Divider orientation="left">Response Box</Divider>
        {this.format_form()}
      </div>
    );
  }
}

export default AnsweringForm;
