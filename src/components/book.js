import React from "react"
import styled from "styled-components"
import styles from "../css/styles"

const Book = styled.img`
  background: ${styles.primary.normal};
  border-radius: 5px;
  box-shadow: 5px 5px 20px 5px ${styles.shadow};
  margin: 0 auto;
  display: block;
  @media only screen and (max-width: 860px) {
    height: 300px;
  }
`

export default class BookImage extends React.Component {
  render() {
    return (
      <Book src={this.props.image} />
    )
  }
}
