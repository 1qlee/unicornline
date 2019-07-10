import React from "react"
import styled from "styled-components"
import Img from "gatsby-image"

const ThumbnailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Thumbnail = styled.figure`
  width: 6rem;
  padding: 1rem;
  border: 1px solid white;
`

const MainProductImage = styled.figure`
  width: 600px;
`

class ProductImages extends React.Component {
  state = {
    currentImage: this.props.images[0]
  }

  handleClick = (e) => {
    console.log(e)
    this.setState({
      currentImage: null
    })
  }

  render() {
    return (
      <div>
        <MainProductImage>
          <Img fluid={this.state.currentImage.fluid} />
        </MainProductImage>
        <ThumbnailRow>
          {this.props.images.map((image, index) => (
            <Thumbnail onClick={this.handleClick(index)}>
              <Img fluid={image.fluid} />
            </Thumbnail>
          ))}
        </ThumbnailRow>
      </div>
    )
  }
}

export default ProductImages
