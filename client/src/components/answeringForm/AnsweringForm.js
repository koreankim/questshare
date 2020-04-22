import React from "react";

const CONFIG = require("../../config.json");

class AnsweringForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q_data: {},
    };
  }

  componentDidMount() {
    const { uuid } = this.props.match.params;

    fetch(CONFIG["proxy"] + "/questions/" + uuid)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        return data;
      })
      .then((data) => {
        this.setState({
          q_data: JSON.parse(data),
        });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  format_question() {
    if (Object.entries(this.state.q_data).length === 0) {
      return <div>No question of that identifier exists!</div>;
    }

    return <div>{this.state.q_data["_question"]}</div>;
  }

  render() {
    return <div>{this.format_question()}</div>;
  }
}

export default AnsweringForm;
