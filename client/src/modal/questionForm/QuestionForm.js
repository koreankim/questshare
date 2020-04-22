import React, { useState } from "react";
import { Button, Cascader, notification, Modal, Form, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PlusCircleOutlined } from "@ant-design/icons";

const CONFIG = require("../../config.json");

const openNotification = (msg, desc, duration) => {
  const args = {
    message: msg,
    description: desc,
    duration: duration,
  };
  notification.open(args);
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const ExpirationSelectMenu = () => {
  return (
    <Form.Item
      name="disableTime"
      label="Disable After:"
      rules={[
        {
          required: true,
          message: "Disable time is required!",
        },
      ]}
    >
      <Cascader
        options={[
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
        ]}
      />
    </Form.Item>
  );
};

const DynamicFieldSet = () => {
  return (
    <Form.List name="options">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <Form.Item
                label={index === 0 ? "Options:" : ""}
                required={true}
                key={field.key}
                {...formItemLayoutWithOutLabel}
              >
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
                    style={{ width: "60%" }}
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
            <Form.Item {...formItemLayoutWithOutLabel}>
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
  );
};

const QuestionTopicSet = () => {
  return (
    <Form.Item
      name="question"
      label="Your Question (max 250 characters)"
      rules={[
        {
          required: true,
          max: CONFIG["max_question_input_length"],
          message: "Invalid inputs for question!",
        },
      ]}
    >
      <Input.TextArea />
    </Form.Item>
  );
};

const CreateQuestionForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const onOk = (onCreate) => {
    if (form.getFieldsValue()["options"] == undefined) {
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
      width="600px"
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
        <ExpirationSelectMenu />
        <DynamicFieldSet />
      </Form>
    </Modal>
  );
};

export const QuestionFormUrlPopup = (data) => {
  const q_url = window.location.host + "/questions/" + data;

  openNotification(
    `Your Shareable URL`,
    <CopyToClipboard text={q_url}>
      <span>
        {q_url} <CopyOutlined style={{ fontSize: "14px" }} />
      </span>
    </CopyToClipboard>,
    0
  );
  return;
};

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
    fetch(CONFIG["proxy"] + "/createquestion", requestOptions)
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
        return QuestionFormUrlPopup(data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    setVisible(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "16px" }}>
        <strong>Reminder</strong>: All questions automatically expire after{" "}
        <strong>7</strong> days!
      </div>
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
