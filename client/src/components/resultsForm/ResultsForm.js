import React from "react";
import CanvasJSReact from "../../assets/canvasjs.react";
import { Statistic, Empty, Divider } from "antd";
import { TeamOutlined } from "@ant-design/icons";

let CanvasJSChart = CanvasJSReact.CanvasJSChart;
class ResultsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      empty: true,
      q_data: props.q_data,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ q_data: nextProps.q_data });

    if (this.state.q_data['_totalVotes'] > 0) {
      this.setState({
        empty: false
      })
    }
  }

  componentDidMount = () => {
    if (this.state.q_data != null && this.state.q_data["_totalVotes"] > 0) {
      this.setState({
        empty: false,
      });
    }
  };

  confGraphOptions = (title, options) => {
    return {
      title: {
        text: title,
      },
      data: [
        {
          type: "pie",
          showInLegend: true,
          legendText: "{label}",
          dataPoints: options,
        },
      ],
    };
  };

  displayEmptyResults = () => {
    return (
      <div>
        <Statistic
          style={{ textAlign: "center" }}
          title="Total Votes"
          value={this.state.q_data["_totalVotes"]}
          prefix={<TeamOutlined />}
        />
        <Divider>Your Meaningful Data</Divider>
        <Empty />
      </div>
    );
  }

  getPieChartData = () => {
    let table = [];
    let options = this.state.q_data["_options"];


    for (let i = 0; i < options.length; i++) {
      let obj = {
        label: options[i]["text"],
        indexLabel: "Choice " + options[i]["choice"],
        y: options[i]["votes"],
      };
      table.push(obj);
    }

    return table;
  }

  displayResults = () => {
    if (this.state.empty === true) {
      return this.displayEmptyResults()
    }

    return (
      <div>
        <Statistic
          style={{ textAlign: "center" }}
          title="Total Votes"
          value={this.state.q_data["_totalVotes"]}
          prefix={<TeamOutlined />}
        />
        <Divider>Your Meaningful Data</Divider>
        <CanvasJSChart options={this.confGraphOptions("Vote Spread", this.getPieChartData())} />
      </div>
    );
  };

  render() {
    return this.displayResults();
  }
}

export default ResultsForm;
