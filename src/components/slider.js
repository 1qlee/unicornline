import React from "react"
import styled from "styled-components"

const sliderStyle = {
  display: "flex",
  overflowX: "auto",
  overflowY: "hidden",
  padding: "1.5rem 1rem",
  position: "relative",
  cursor: "grab"
}

const FadeBlock = styled.div`
  position: -webkit-sticky;
  position: sticky;
  left: -1rem;
  padding: 0.2rem;
  z-index: 9;
  filter: blur(4px);
  -webkit-filter: blur(4px);
  background: rgba(0,0,0,0.4);
  transition: background 0.2s;
  &.invisible {
    background: transparent;
  }
`

function FadeShit(props) {
  if (props.toggle > 20) {
    return (
      <FadeBlock />
    )
  }
  else {
    return (
      <FadeBlock className="invisible"/>
    )
  }
}

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.slider = React.createRef();
    this.state = {
      mouseDown: false,
      startX: null,
      scrollLeft: null,
      current: null
   };
  }

  handleMouseDown = (e) => {
    this.setState({
      mouseDown: true,
      startX: e.pageX - this.slider.current.offsetLeft,
      scrollLeft: this.slider.current.scrollLeft
    })
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
    this.setState({
      current: this.slider.current.scrollLeft
    })
    this.slider.current.scrollLeft = this.state.scrollLeft - diff
  }

  render() {
    return (
      <section style={sliderStyle} ref={this.slider} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} onMouseMove={this.handleMouseMove}>
        <FadeShit toggle={this.state.current} />
        {this.props.children}
      </section>
    )
  }
}
