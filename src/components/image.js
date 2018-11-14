import React from "react"
import styled from "styled-components"
import styles from "../css/styles.js"

const ImageContainer = styled.figure`
  display: block;
  margin-bottom: 1rem;
`

const Image = styled.img`
  border: 0.3rem solid white;
  box-shadow: 0 10px 30px 0 ${styles.shadow};
  display: block;
  height: auto;
  opacity: 0.9;
  transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
  width: 100%;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
  &.max {
    position: absolute;
    opacity: 1;
    width: calc(100% - 4rem);
    top: 2rem;
    height: calc(100% - 4rem);
    z-index: 99;
  }
`

class ImageComponent extends React.Component {
  constructor(props) {
    super(props)
    // Bind Methods
    this.handleClick = this.handleClick.bind(this)
    // Manage state
    this.state = {
      isOpen: false,
    }
  }

  handleClick() {
    this.setState({
      isOpen: this.state.isOpen ? false : true,
    })
  }

  render() {
    return (
      <Image className={this.state.isOpen ? "max" : null} src={this.props.src} alt={this.props.alt} onClick={this.handleClick}/>
    )
  }
}

const ImageModal = styled.dialog`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.9);
  width: 100vw;
  height: 100vh;
  z-index: 99;
`

export {ImageContainer, Image, ImageModal, ImageComponent}
