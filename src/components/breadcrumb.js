import React from "react"
import styled from "styled-components"

import styles from "../css/styles"

const BreadCrumbContainer = styled.nav`
  display: block;
  ul {
    display: flex;
    list-style-type: none;
    margin: 1rem 0;
  }
  li {
    &:not(:first-child) {
      &::before {
        color: ${styles.whiteLight};
        content: "\0002f";
      }
    }
  }
  a {
    color: ${styles.whiteLight};
    position: relative;
    padding: 0 0.75rem;
    &.first {
      padding-left: 0;
    }
    &:hover {
      color: ${styles.white};
    }
  }
`

class BreadCrumb extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <BreadCrumbContainer >
        <ul>
          <li>
            <a className="first" href="/">{this.props.parent}</a>
          </li>
          <li>
            <a href={"/" + this.props.category.substring(0).toLowerCase()}>{this.props.category}</a>
          </li>
          { this.props.product ? (
            <li>
              <a href={"/" + this.props.product.substring(0).toLowerCase()}>{this.props.product}</a>
            </li>
          ) : (
            null
          )}
        </ul>
      </BreadCrumbContainer>
    )
  }
}

export default BreadCrumb
