import React from "react"
import Img from "gatsby-image"

class ImageComponent extends React.Component {
  render() {
    return (
      <div>
        <figure>
          <Img fluid={this.props.thumbnail} />
        </figure>
        <div style={{width: "100px"}}>
          <Img fluid={this.props.thumbnail} />
        </div>
      </div>
    )
  }
}

export default ImageComponent
