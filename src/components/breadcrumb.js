import React from "react"
import styled from "styled-components"

import styles from "../css/styles"

const BreadCrumbContainer = styled.nav`
  display: block;
  ul {
    display: flex;
    list-style-type: none;
    margin-bottom: 1rem;
  }
  li {
    &:not(:first-child) {
      &::before {
        color: ${styles.grey.text};
        content: "\0002f";
      }
    }
  }
  a {
    color: ${styles.grey.text};
    position: relative;
    padding: 0 0.75rem;
    &.first {
      padding-left: 0;
    }
    &:hover {
      color: ${styles.text};
    }
  }
`

function BreadCrumb(props) {
  return (
    <BreadCrumbContainer>
      <ul>
        <li>
          <a className="first" href="/">{props.parent}</a>
        </li>
        <li>
          <a href={"/" + props.category.substring(0).toLowerCase()}>{props.category}</a>
        </li>
        { props.product ? (
          <li>
            <a href={"/" + props.product.substring(0).toLowerCase()}>{props.product}</a>
          </li>
        ) : (
          null
        )}
      </ul>
    </BreadCrumbContainer>
  )
}

export default BreadCrumb
