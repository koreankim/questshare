import React from "react";
import { Radio, Form, Button } from "antd";
import Error from "../error/Error";
import { sendData } from "../../utils/api/Api";

class ResultsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q_data: props.q_data,
    };
  }

  displayResults = () => {
    let table = [];
    let options = this.state.q_data["_options"];

    for (let i = 0; i < options.length; i++) {
      table.push(<strong>{options[i]["votes"]}</strong>);

    }
    return table;
  };

  render() {
    return <div>{this.displayResults()}</div>;
  }
}

export default ResultsForm;
