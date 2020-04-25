import React from "react";
import CanvasJSReact from "../../assets/canvasjs.react";
import { Row, Col, Statistic, Empty, Divider } from "antd";
import { TeamOutlined } from "@ant-design/icons";

let CanvasJSChart = CanvasJSReact.CanvasJSChart;
class ResultsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      empty: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.q_data["_totalVotes"] === 0 &&
      this.props.q_data["_totalVotes"] > 0
    ) {
      this.setState({
        empty: false,
      });
    }
  }

  componentDidMount = () => {
    if (this.props.q_data != null && this.props.q_data["_totalVotes"] > 0) {
      this.setState({
        empty: false,
      });
    }
  };

  displayEmptyResults = () => {
    return (
      <div>
        <Statistic
          style={{ textAlign: "center" }}
          title="Total Votes"
          value={this.props.q_data["_totalVotes"]}
          prefix={<TeamOutlined />}
        />
        <Divider>Your Meaningful Data</Divider>
        <Empty />
      </div>
    );
  };

  confGraphOptionsWithLegend = (title, type, options, legend) => {
    return {
      title: {
        text: title,
      },
      data: [
        {
          type: type,
          showInLegend: true,
          legendText: legend,
          dataPoints: options,
        },
      ],
    };
  };

  confGraphOptions = (title, type, options) => {
    return {
      title: {
        text: title,
      },
      axisY: {
        interval: 1,
      },
      axisX: {
        interval: 1,
      },
      data: [
        {
          type: type,
          dataPoints: options,
        },
      ],
    };
  };

  getPieChartData = () => {
    let table = [];
    let options = this.props.q_data["_options"];

    for (let i = 0; i < options.length; i++) {
      let obj = {
        label: options[i]["text"],
        indexLabel: "Choice " + options[i]["choice"],
        y: options[i]["votes"],
      };
      table.push(obj);
    }

    return table;
  };

  getBarChartData = () => {
    let table = [];
    let options = this.props.q_data["_options"];

    for (let i = 0; i < options.length; i++) {
      let obj = {
        label: "Choice " + options[i]["choice"],
        y: options[i]["votes"],
      };
      table.push(obj);
    }

    return table;
  };

  displayResults = () => {
    if (this.state.empty === true) {
      return this.displayEmptyResults();
    }

    return (
      <div>
        <Row>
          <Col flex={1}>
            <Statistic
              style={{ textAlign: "center" }}
              title="Total Votes"
              value={this.props.q_data["_totalVotes"]}
              prefix={<TeamOutlined />}
            />
          </Col>
        </Row>
        <Divider>Your Meaningful Data</Divider>
        <Row>
          <Col flex={1}>
            <CanvasJSChart
              options={this.confGraphOptions(
                "Vote Spread",
                "bar",
                this.getBarChartData()
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col flex={1}>
            <CanvasJSChart
              options={this.confGraphOptionsWithLegend(
                "",
                "pie",
                this.getPieChartData(),
                "{label}"
              )}
            />
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return this.displayResults();
  }
}

export default ResultsForm;
