import img from "./error.gif";
import { Component } from "react";

class ErrorMessage extends Component {
  render() {
    return (
      <img
        style={{
          display: "block",
          width: "250px",
          height: "250px",
          objectFit: "contain",
          margin: "0 auto",
        }}
        alt="Error"
        src={img}
      />
    );
  }
}

export default ErrorMessage;
