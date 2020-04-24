import React, { useState } from "react";
import { Divider, Row, Col, Button, Cascader, Modal, Form, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PlusCircleOutlined } from "@ant-design/icons";
import { sendDataWithOptions } from "../../utils/api/Api";
import { openNotification } from "../notification/Notification";

const CONFIG = require("../../config.json");

// Expiration date selection menu
const ExpirationSelectMenu = () => {
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

  return (
    <Row>
      <Col flex={1}>
        <Form.Item
          name="disableTime"
          label={<strong>Disable After</strong>}
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

// Options
const DynamicFieldSet = () => {
  return (
    <Row>
      <Col style={{ textAlign: "center" }} flex={1} xs={{ offset: 1 }}>
        <Form.List name="options">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
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
                ))}
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
              </div>
            );
          }}
        </Form.List>
      </Col>
    </Row>
  );
};

// Question text field
const QuestionTopicSet = () => {
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

const CreateQuestionForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const onOk = (onCreate) => {
    if (form.getFieldsValue()["options"] === undefined) {
      openNotification(
        `Your form is incomplete!`,
        "You must have at least (1) option before submitting.",
        3
      );
      return;
    }

    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info); //Get rid of later
      });
  };

  return (
    <Modal
      visible={visible}
      title="Create a New Question"
      okText="Create"
      width="850px"
      cancelText="Cancel"
      maskClosable={false}
      onCancel={() => {
        onCancel(form);
      }}
      onOk={() => {
        onOk(onCreate);
      }}
    >
      <Form form={form} layout="vertical" name="question_form">
        <QuestionTopicSet />
        <Divider>Configurations</Divider>
        <ExpirationSelectMenu />
        <Divider>Response Options</Divider>
        <DynamicFieldSet />
      </Form>
    </Modal>
  );
};

// Popup with the shareable question url
export const QuestionFormUrlPopup = (data) => {
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

// Create question button in the /create path
export const CreateQuestionButton = () => {
  const [visible, setVisible] = useState(false);

  const onCancel = (form) => {
    form.resetFields();
    setVisible(false);
  };

  const onCreate = (values) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: values["question"],
        options: values["options"],
        disableTime: values["disableTime"],
      }),
    };
    sendDataWithOptions("/createquestion", requestOptions)
      .then((data) => {
        return QuestionFormUrlPopup(data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    setVisible(false);
  };

  return (
    <div>
      <Button
        style={{ margin: "25px 0px" }}
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        <PlusCircleOutlined />
        New Question
      </Button>
      <CreateQuestionForm
        visible={visible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </div>
  );
};
