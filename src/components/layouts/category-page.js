import React from "react"
import { graphql } from "gatsby"

import Main from "../main"
import Content from "../content"
import NavBar from "../nav"
import Hero from "../hero"
import {Title, Subtitle} from "../title"
import {CardContainer, Card, CardContent, CardImage} from "../card"

import styles from "../../css/styles"

export default ({ data }) => {
  const category = data.datoCmsCategory
  const products = data.allDatoCmsProduct

  return (
    <Main>
      <NavBar />
      <Hero>
        <Content className="has-text-centered">
          <Title color={styles.white}>{category.name}</Title>
          <Subtitle color={styles.whiteLight} dangerouslySetInnerHTML={{ __html: category.description }}></Subtitle>
        </Content>
      </Hero>
      <CardContainer>
        {products.edges.map(({ node: product }) => (
          <Card key={product.id} href={product.slug}>
            <CardImage>
              <img src="https://via.placeholder.com/300x200" alt="Placeholder" />
            </CardImage>
            <CardContent>
              <Content>
                <p className="label">{product.name}</p>
                <p>{product.description}</p>
              </Content>
            </CardContent>
          </Card>
        ))}
      </CardContainer>
    </Main>
  )
}

export const query = graphql`
  query CategoryQuery($category: String!) {
    datoCmsCategory(name: { eq: $category }) {
      name
      description
    }
    allDatoCmsProduct(filter: {category: {eq: $category}}) {
      edges {
        node {
          category
          description
          id
          name
          slug
        }
      }
    }
  }
`
