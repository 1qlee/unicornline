import React from "react"
import styled from "styled-components"
import styles from "../css/styles"
import Img from "gatsby-image"

const ThumbnailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

const Thumbnail = styled.figure`
  width: 60px;
  padding: 0.3rem;
  border: 2px solid ${styles.grey.border};
  transition: border 0.3s ease;
  margin: 0.5rem;
  &.is-active {
    border-color: ${styles.grey.normal};
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
      <div style={{marginBottom:"1rem"}}>
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
