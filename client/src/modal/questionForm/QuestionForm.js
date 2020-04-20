import React, { useState } from "react";
import { Button, Cascader, notification, Modal, Form, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { RadiusUprightOutlined } from "@ant-design/icons";

const CONFIG = require("../../config.json");

const openNotification = (placement, msg, desc) => {
  notification.info({
    message: msg,
    description: desc,
    placement,
  });
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
                      "topRight",
                      "Too many options!",
                      "You may only have (" +
                        CONFIG["free_tier_max_options"] +
                        ") options per question."
                    );
                    return <RadiusUprightOutlined />;
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
        "topRight",
        `Your form is incomplete!`,
        "You must have at least (1) option before submitting."
      );
      return <RadiusUprightOutlined />;
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
        disableTime: values["disableTime"]
      }),
    };
    fetch(CONFIG["proxy"] + "/createquestion", requestOptions)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          console.log(response); // TODO: Remove later
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return data;
      })
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    console.log("Received values of form: ", values);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
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
