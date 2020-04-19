import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const CONFIG = require('../../config.json')

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const DynamicFieldSet = () => {
  return (
    <Form.List name="options">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <Form.Item
                {...formItemLayoutWithOutLabel}
                label={index === 0 ? "Options:" : ""}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please fill or delete this option.",
                    },
                    () => ({
                      validator(rule, value) {
                        if (!value || value.length <= 100) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Option is too long!");
                      },
                    }),
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
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
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

const CreateQuestionForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a New Question"
      okText="Create"
      cancelText="Cancel"
      onCancel={() => {
        onCancel(form);
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info); //Get rid of later
          });
      }}
    >
      <Form form={form} layout="vertical" name="question_form">
        <Form.Item
          name="question"
          label="Your Question"
          rules={[
            {
              required: true,
              message: "A question is required!",
            },
            () => ({
              validator(rule, value) {
                if (!value || value.length <= 300) {
                  return Promise.resolve();
                }
                return Promise.reject("Question is too long!");
              },
            }),
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <DynamicFieldSet />
        </Form.Item>
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
      body: JSON.stringify({ title: values['question'], options : values['options']}),
    };
    fetch(CONFIG['proxy'] + "/createquestion", requestOptions)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          console.log(response) // TODO: Remove later
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return data;
      })
      .then(responseJson => {
        console.log(responseJson)
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
