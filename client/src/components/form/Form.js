import React from "react";
import { Tabs, Spin } from "antd";
import { QuestionCircleOutlined, AlignLeftOutlined } from "@ant-design/icons";
import AnsweringForm from "../answeringForm/AnsweringForm";

const { TabPane } = Tabs;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: false,
    });
  };

  load_tabs = () => {
    if (this.state.loading === true) {
      return <Spin />;
    }

    const { uuid } = this.props.match.params;

    return (
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <QuestionCircleOutlined />
              Question
            </span>
          }
          key="1"
        >
          <AnsweringForm uuid={uuid} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AlignLeftOutlined />
              Results
            </span>
          }
          key="2"
        >
          Results
        </TabPane>
      </Tabs>
    );
  };

  render() {
    return this.load_tabs();
  }
}

export default Form;
