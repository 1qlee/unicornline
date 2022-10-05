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
  li {
    position: relative;
    &:not(:last-child) {
      &::before {
        content: "/";
        position: absolute;
        color: ${styles.grey.normal};
        right: -0.35rem;
      }
    }
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

function checkCategorySlug(props) {
  if (!props.categoryName) {
    let words = props.categorySlug.split("-")
    let capitalizedString = ""

    words.forEach((word, index) => {
      console.log(word)
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1)
      if (index === 0) {
        capitalizedString += capitalizedWord + " "
      }
      else {
        capitalizedString += capitalizedWord
      }
    })

    return capitalizedString
  }
  else {
    return props.categoryName
  }
}

function formatCategorySlug(slug) {
  let formattedSlug;

  if (/\s/.test(slug)) {
    formattedSlug = slug.split(" ").join("-")
  }
  else {
    formattedSlug = slug
  }

  return formattedSlug.toLowerCase()
}

function BreadCrumb(props) {
  return (
    <BreadCrumbContainer>
      <ul>
        <li>
          <Link className="first" to="/">{props.parent}</Link>
        </li>
        <li>
          <Link to={"/" + formatCategorySlug(props.categorySlug)}>{checkCategorySlug(props)}</Link>
        </li>
        { props.product ? (
          <li>
            <Link to={"/" + formatCategorySlug(props.categorySlug) + "/" + props.slug}>{props.product}</Link>
          </li>
        ) : (
          null
        )}
      </ul>
    </BreadCrumbContainer>
  )
}

export default BreadCrumb
