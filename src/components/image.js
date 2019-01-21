import React from "react"
import styled from "styled-components"
import styles from "../css/styles.js"
import ImageGallery from "react-image-gallery"

import "react-image-gallery/styles/css/image-gallery.css"

const ImageContainer = styled.figure`
  display: block;
  margin-bottom: 1rem;
  position: relative;
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

    const newImages = []

    for (let i = 0; i < this.props.images.length; i++) {
      const newObj = {
        original: this.props.images[i].url,
        originalAlt: this.props.images[i].alt,
        thumbnail: this.props.images[i].url
      }

      newImages.push(newObj)
    }

    this.state = {
      images: newImages
    }
  }

  render() {
    const images = [
      {
        original: 'https://placekitten.com/600/380',
        thumbnail: 'https://placekitten.com/600/380',
      },
      {
        original: 'https://placekitten.com/601/380',
        thumbnail: 'https://placekitten.com/601/380'
      },
      {
        original: 'https://placekitten.com/599/380',
        thumbnail: 'https://placekitten.com/599/380'
      }
    ]

    return (
      <ImageGallery items={images} showPlayButton={false} useBrowserFullscreen={false} />
    )
  }
}


export {ImageContainer, Image, ImageComponent}
