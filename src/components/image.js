import React from "react"
import styled from "styled-components"
import styles from "../css/styles.js"
import ImageGallery from "react-image-gallery"

import "react-image-gallery/styles/css/image-gallery.css"

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

  render() {
    const images = this.props.images
    console.log(images)

    return (
      <ImageGallery items={images} showPlayButton={false} />
    );
  }
}


export {ImageContainer, Image, ImageComponent}
