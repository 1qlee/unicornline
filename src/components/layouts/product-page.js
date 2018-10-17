import React from "react"
import { graphql } from "gatsby"

export default ({ data }) => {
  const product = data.datoCmsProduct

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.category}</p>
      <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
    </div>
  )
}

export const query = graphql`
  query ProductQuery($slug: String!) {
    datoCmsProduct(slug: { eq: $slug }) {
      name
      category
      description
    }
  }
`
