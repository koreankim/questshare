import React from "react";
import CanvasJSReact from "../../assets/canvasjs.react";

let CanvasJS = CanvasJSReact.CanvasJS;
let CanvasJSChart = CanvasJSReact.CanvasJSChart;
class ResultsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q_data: props.q_data,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ q_data: nextProps.q_data });
  }

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

  displayResults = () => {
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

    return (
      <div>
        <CanvasJSChart options={this.confGraphOptions("Vote Spread", table)} />
      </div>
    );
  };

  render() {
    return this.displayResults();
  }
}

export default ResultsForm;
