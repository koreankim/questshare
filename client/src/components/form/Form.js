import React from "react";
import { Tabs, Spin } from "antd";
import { QuestionCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import AnsweringForm from "../answeringForm/AnsweringForm";
import ResultsForm from "../resultsForm/ResultsForm";
import { sendData } from "../../utils/api/Api";

const { TabPane } = Tabs;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.disableHandler = this.disableHandler.bind(this);
    this.state = {
      loading: true,
      disabled: false,
      q_data: {},
    };
  }

  disableHandler = () => {
    this.setState({
      disabled: true,
    });
  };

  fetchData = () => {
    const { uuid } = this.props.match.params;
    sendData("/questions/" + uuid)
      .then((data) => {
        this.setState({
          q_data: JSON.parse(data),
          loading: false,
        });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  componentWillUnmount() {
    clearInterval(this.keepWatchingData);
  }

  componentDidMount = () => {
    this.fetchData();

    this.keepWatchingData = setInterval(
      () => (this.state.disabled ? "" : this.fetchData()),
      5000
    );
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
          <AnsweringForm
            q_data={this.state.q_data}
            disableHandler={this.disableHandler}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Results
            </span>
          }
          key="2"
        >
          <ResultsForm q_data={this.state.q_data} />
        </TabPane>
      </Tabs>
    );
  };

  render() {
    return this.load_tabs();
  }
}

export default Form;
