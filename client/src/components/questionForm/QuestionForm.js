import React from "react";
import {
  Tooltip,
  Divider,
  Row,
  Col,
  Button,
  Cascader,
  Modal,
  Form,
  Input,
  Radio,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { sendDataWithOptions } from "../../utils/api/Api";
import { openNotification } from "../../modal/notification/Notification";

const CONFIG = require("../../config.json");
const DEFAULT_SECURITY_TYPE = 2

class QuestionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      securityType: DEFAULT_SECURITY_TYPE,
    };
  }

  formRef = React.createRef();

  questionTopicSet = () => {
    return (
      <Row>
        <Col flex={1}>
          <Form.Item
            name="question"
            label={<strong>Your Question</strong>}
            rules={[
              {
                required: true,
                max: CONFIG["max_question_input_length"],
                message: "Invalid inputs for question!",
              },
            ]}
          >
            <Input.TextArea placeholder="Question (max 250 characters)" />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  displayInputFields = (fields, field, remove) => {
    return (
      <Form.Item required={true} key={field.key}>
        <Form.Item
          {...field}
          validateTrigger={["onChange", "onBlur"]}
          rules={[
            {
              required: true,
              whitespace: true,
              max: CONFIG["max_options_input_length"],
              message: "Invalid inputs for option!",
            },
          ]}
          noStyle
        >
          <Input
            placeholder="option (max 100 characters)"
            style={{ width: "80%" }}
          />
        </Form.Item>
        {fields.length > 1 ? (
          <MinusCircleOutlined
            className="dynamic-delete-button"
            style={{ margin: "0 8px" }}
            onClick={() => {
              remove(field.name);
            }}
          />
        ) : null}
      </Form.Item>
    );
  };

  displayAddInputFieldButton = (fields, add) => {
    return (
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => {
            if (fields.length >= CONFIG["free_tier_max_options"]) {
              openNotification(
                "Too many options!",
                "You may only have (" +
                  CONFIG["free_tier_max_options"] +
                  ") options per question.",
                3
              );
              return;
            }
            add();
          }}
          style={{ width: "60%" }}
        >
          <PlusOutlined /> Add Option
        </Button>
      </Form.Item>
    );
  };

  dynamicFieldSet = () => {
    return (
      <Row style={{ textAlign: "center" }}>
        <Col flex={1} xs={{ offset: 1 }}>
          <Form.List name="options">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) =>
                    this.displayInputFields(fields, field, remove)
                  )}
                  {this.displayAddInputFieldButton(fields, add)}
                </div>
              );
            }}
          </Form.List>
        </Col>
      </Row>
    );
  };

  // Expiration date selection menu
  expirationSelectMenu = () => {
    const expirationOptions = () => {
      return [
        {
          value: 1,
          label: "1 minute",
        },
        {
          value: 5,
          label: "5 minute",
        },
        {
          value: 10,
          label: "10 minutes",
        },
        {
          value: 30,
          label: "30 minutes",
        },
        {
          value: 60,
          label: "60 minutes",
        },
      ];
    };

    const EXP_TOOLTIP_MSG =
      "After this time period, responses will no longer be accepted.";

    return (
      <Row>
        <Col flex={1}>
          <Form.Item
            name="disableTime"
            label={
              <span>
                <strong>Disable After</strong>
                <Tooltip title={EXP_TOOLTIP_MSG}>
                  {" "}
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Disable time is required!",
              },
            ]}
          >
            <Cascader options={expirationOptions()} />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  votingSecurityTypeSelectionMenu = () => {
    const onChange = (e) => {
      this.setState({
        securityType: e.target.value,
      });
    };

    const SECURITY_TOOLTIP_MSG =
      "Security types determine how often and in what way the users can respond to your quesiton.";
    const UNLIMITED_TOOLTIP_SECURITY_MSG =
      "Selecting this will require users to validate they are human before submission.";

    return (
      <Row>
        <Col flex={1}>
          <Form.Item
            name="securityType"
            required={true}
            label={
              <span>
                <strong>Security Type</strong>
                <Tooltip title={SECURITY_TOOLTIP_MSG}>
                  {" "}
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please select a security type!",
              },
            ]}
          >
            <Radio.Group
              onChange={onChange}
            >
              <Tooltip title={UNLIMITED_TOOLTIP_SECURITY_MSG}>
                <Radio value={1}>Unlimited</Radio>
              </Tooltip>
              <Radio value={2}>IP Specific</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    );
  };

  displayQuestionFormUrlPopup = (data) => {
    const q_url = window.location.host + "/questions/" + data;

    openNotification(
      `Your QuestShare URL`,
      <CopyToClipboard text={q_url}>
        <span>
          {q_url} <CopyOutlined style={{ fontSize: "14px" }} />
        </span>
      </CopyToClipboard>,
      0
    );
    return;
  };

  displayQuestionForm = () => {
    const onCancel = (form) => {
      form.current.resetFields();
      this.props.visibilityHandler(false);
    };

    const onCreate = (values) => {
      console.log(values)
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: values["question"],
          options: values["options"],
          disableTime: values["disableTime"],
          securityType: values["securityType"],
        }),
      };
      sendDataWithOptions("/createquestion", requestOptions)
        .then((data) => {
          return this.displayQuestionFormUrlPopup(data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
      this.props.visibilityHandler(false);
    };

    const onOk = (onCreate) => {
      if (this.formRef.current.getFieldsValue()["options"] === undefined) {
        openNotification(
          `Your form is incomplete!`,
          "You must have at least (1) option before submitting.",
          3
        );
        return;
      }

      this.formRef.current
        .validateFields()
        .then((values) => {
          this.formRef.current.resetFields();
          onCreate(values);
        })
        .catch((info) => {
          console.log("Validate Failed:", info); //Get rid of later
        });
    };

    return (
      <Modal
        visible={this.props.visible}
        title="Create a New Question"
        okText="Create"
        width="850px"
        cancelText="Cancel"
        maskClosable={false}
        onCancel={() => {
          onCancel(this.formRef);
        }}
        onOk={() => {
          onOk(onCreate);
        }}
      >
        <Form ref={this.formRef} layout="vertical" name="question_form">
          {this.questionTopicSet()}
          <Divider>Configurations</Divider>
          {this.expirationSelectMenu()}
          {this.votingSecurityTypeSelectionMenu()}
          <Divider>Response Options</Divider>
          {this.dynamicFieldSet()}
        </Form>
      </Modal>
    );
  };

  render() {
    return this.displayQuestionForm();
  }
}

export default QuestionForm;
