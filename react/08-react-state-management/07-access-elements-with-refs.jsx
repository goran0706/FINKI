import React, { Component, createRef, useEffect, useRef } from "react";

export class AccessElementsWithCreateRef extends Component {
  buttonRef = createRef();

  onClickHandler = () => {
    // We can use references to access the elements between rerenders
    if (this.buttonRef.current.style.backgroundColor === "red") {
      this.buttonRef.current.style.backgroundColor = "blue";
      this.buttonRef.current.style.cursor = "pointer";
    } else {
      this.buttonRef.current.style.backgroundColor = "red";
      this.buttonRef.current.style.cursor = "not-allowed";
    }
  };

  componentDidMount() {
    this.buttonRef.current.style.color = "white";
    this.buttonRef.current.style.backgroundColor = "blue";
    this.buttonRef.current.style.padding = "8px 16px";
    this.buttonRef.current.style.outline = "none";
    this.buttonRef.current.style.border = "none";
    this.buttonRef.current.style.borderRadius = "16px";
    this.buttonRef.current.style.cursor = "pointer";
  }

  render() {
    return (
      <div>
        <button ref={this.buttonRef} onClick={this.onClickHandler}>
          Click Me!
        </button>
      </div>
    );
  }
}

export const AccessElementsWithUseRef = () => {
  const buttonRef = useRef();

  const onClickHandler = () => {
    // We can use references to access the elements between rerenders
    if (buttonRef.current.style.backgroundColor === "red") {
      buttonRef.current.style.backgroundColor = "blue";
      buttonRef.current.style.cursor = "pointer";
    } else {
      buttonRef.current.style.backgroundColor = "red";
      buttonRef.current.style.cursor = "not-allowed";
    }
  };

  useEffect(() => {
    buttonRef.current.style.color = "white";
    buttonRef.current.style.backgroundColor = "blue";
    buttonRef.current.style.padding = "8px 16px";
    buttonRef.current.style.outline = "none";
    buttonRef.current.style.border = "none";
    buttonRef.current.style.borderRadius = "16px";
    buttonRef.current.style.cursor = "pointer";
  }, []);

  return (
    <div>
      <button ref={buttonRef} onClick={onClickHandler}>
        Click Me!
      </button>
    </div>
  );
};
