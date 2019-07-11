import React from "react"
import styled from "styled-components"
import styles from "../css/styles"
import Img from "gatsby-image"

const ThumbnailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Thumbnail = styled.figure`
  width: 6rem;
  padding: 0.3rem;
  border: 2px solid ${styles.shadow};
  transition: border 0.3s ease;
  &.is-active {
    border-color: ${styles.white.normal};
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      border-color: ${styles.grey.hover};
    }
  }
`

const MainProductImage = styled.figure`
  margin-bottom: 1rem;
  width: 100%;
`

class ProductImages extends React.Component {
  state = {
    activeImage: 0,
    allImages: this.props.images,
    currentImage: this.props.images[0]
  }

  handleClick = (index) => {
    this.setState({
      activeImage: index,
      currentImage: this.props.images[index]
    })
  }

  render() {
    return (
      <div>
        <MainProductImage>
          <Img fluid={this.state.currentImage.fluid} />
        </MainProductImage>
        <ThumbnailRow>
          {this.state.allImages.map((image, index) => (
            <Thumbnail key={index} className={this.state.activeImage === index ? "is-active" : null} onClick={() => this.handleClick(index)}>
              <Img fluid={image.fluid} />
            </Thumbnail>
          ))}
        </ThumbnailRow>
      </div>
    )
  }
}

export default ProductImages
