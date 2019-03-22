import React from "react"
import styled from "styled-components"
import styles from "../css/styles"

const sliderStyle = {
  display: "flex",
  overflowX: "auto",
  padding: "1rem"
}

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.slider = React.createRef();
    this.state = {
      mouseDown: false,
      startX: null,
      scrollLeft: null
   };
  }

  handleMouseDown = (e) => {
    this.setState({
      mouseDown: true,
      startX: e.pageX - this.slider.current.offsetLeft,
      scrollLeft: this.slider.current.scrollLeft
    })
    console.log(this.state.startX)
  }

  handleMouseLeave = (e) => {
    this.setState({
      mouseDown: false
    })
  }

  handleMouseUp = (e) => {
    this.setState({
      mouseDown: false
    })
  }

  handleMouseMove = (e) => {
    if (!this.state.mouseDown) {
      return;
    }
    e.preventDefault()
    const x = e.pageX - this.slider.current.offsetLeft
    const diff = x - this.state.startX
    console.log(diff)
    console.log(this.slider.current)
    this.slider.current.scrollLeft = this.state.scrollLeft - diff
  }

  render() {
    return (
      <div style={sliderStyle} ref={this.slider} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} onMouseMove={this.handleMouseMove}>
        {this.props.children}
      </div>
    )
  }
}
