import React from "react";
import { Tabs, Spin } from "antd";
import { QuestionCircleOutlined, AlignLeftOutlined } from "@ant-design/icons";
import AnsweringForm from "../answeringForm/AnsweringForm";
import ResultsForm from "../resultsForm/ResultsForm";
import  { sendData } from "../../utils/api/Api"

const { TabPane } = Tabs;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      deadLine: 0,
      q_data: {}
    };
  }

  fetchData = () => {
    const { uuid } = this.props.match.params;

    sendData("/questions/" + uuid)
      .then((data) => {
        this.setState({
          q_data: JSON.parse(data),
          loading: false,
        });
        console.log(this.state.q_data)
        return data;
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  componentDidMount = () => {
    this.fetchData();
  };

  load_tabs = () => {
    if (this.state.loading === true) {
      return <Spin />;
    }

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
          <AnsweringForm q_data={this.state.q_data}/>
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
          <ResultsForm q_data={this.state.q_data}/>
        </TabPane>
      </Tabs>
    );
  };

  render() {
    return this.load_tabs();
  }
}

export default Form;
