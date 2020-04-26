import React from "react";
import { Card, Tabs, Spin } from "antd";
import { QuestionCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import AnsweringForm from "../answeringForm/AnsweringForm";
import ResultsForm from "../resultsForm/ResultsForm";
import { sendData, fetchIP } from "../../utils/api/Api";
import Error from "../error/Error";

const { TabPane } = Tabs;

const CONFIG = require("../../config.json");

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.disableHandler = this.disableHandler.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      loading: true,
      disabled: false,
      securityType: 2,
      activeTab: 1,
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

    this.setState({
      loading: true,
    });

    sendData("/questions/" + uuid)
      .then((data) => {
        this.setState({
          q_data: JSON.parse(data),
          uuid: uuid,
        });
      })
      .then(() => {
        if (this.state.q_data["_securityType"] === CONFIG["ip_specific_security_type"]) {
          fetchIP()
            .then((ip_d) => {
              this.setState({
                ip: ip_d,
              });
            })
            .catch((error) => {
              console.error("There was an error fetching the IP!", error);
            });
        }
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the question!", error);
      });
  };

  componentDidMount = () => {
    this.fetchData();
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

    const onChange = (e) => {
      this.setState({
        activeTab: e,
      });
    };

    return (
      <Card>
        <Tabs
          style={{ textAlign: "center" }}
          defaultActiveKey={this.state.activeTab}
          onChange={onChange}
        >
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
            <ResultsForm
              q_data={this.state.q_data}
              fetchData={this.fetchData}
              loading={this.state.loading}
            />
          </TabPane>
        </Tabs>
      </Card>
    );
  };

  render() {
    return this.load_tabs();
  }
}

export default Form;
