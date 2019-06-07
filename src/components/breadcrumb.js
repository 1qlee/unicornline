import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles"

const BreadCrumbContainer = styled.nav`
  display: block;
  ul {
    display: flex;
    list-style-type: none;
    margin-bottom: 1rem;
  }
  a {
    color: ${styles.grey.normal};
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
          <Link className="first" to="/">{props.parent}</Link> /
        </li>
        <li>
          <Link to={"/" + props.category.substring(0).toLowerCase()}>{props.category}</Link> /
        </li>
        { props.product ? (
          <li>
            <Link to={"/" + props.category.substring(0).toLowerCase() + "/" + props.slug}>{props.product}</Link>
          </li>
        ) : (
          null
        )}
      </ul>
    </BreadCrumbContainer>
  )
}

export default BreadCrumb
