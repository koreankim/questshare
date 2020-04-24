import React from "react";
import { Tabs, Spin } from "antd";
import { QuestionCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import AnsweringForm from "../answeringForm/AnsweringForm";
import ResultsForm from "../resultsForm/ResultsForm";
import { sendData, fetchIP } from "../../utils/api/Api";
import Error from "../error/Error";

const { TabPane } = Tabs;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.disableHandler = this.disableHandler.bind(this);
    this.state = {
      loading: true,
      disabled: false,
      q_data: {},
      uuid: 0,
      ip: 0,
    };
  }

  disableHandler = () => {
    this.setState({
      disabled: true,
    });
  };

  fetchData = () => {
    const { uuid } = this.props.match.params;
    fetchIP()
      .then((ip_d) => {
        this.setState({
          ip: ip_d,
        });
      })
      .then(() => {
        sendData("/questions/" + uuid)
          .then((data) => {
            this.setState({
              q_data: JSON.parse(data),
              uuid: uuid,
              loading: false,
            });
          })
          .catch((error) => {
            console.error("There was an error fetching the question!", error);
          });
      })
      .catch((error) => {
        console.error("There was an error fetching the IP!", error);
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
    if (
      this.state.q_data == null ||
      Object.entries(this.state.q_data).length === 0
    ) {
      return <Error />;
    }

    return (
      <Tabs style={{textAlign: "center"}} defaultActiveKey="1">
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
            uuid={this.state.uuid}
            disableHandler={this.disableHandler}
            ip={this.state.ip}
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
