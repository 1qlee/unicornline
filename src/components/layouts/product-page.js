import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"

import Container from "../container"
import Main from "../main"
import Content from "../content"
import NavBar from "../nav"
import Hero from "../hero"
import {Title, Subtitle} from "../title"
import {CardContainer, Card, CardContent, CardImage} from "../card"

import styles from "../../css/styles"

const ProductContainer = styled.div`
  border-radius: 12px;
  background: ${styles.white};
  width: 100%;
  height: 100%;
  padding: 1rem;
`

export default ({ data }) => {
  const product = data.datoCmsProduct

  return (
    <Main>
      <Container>
        <NavBar />
        <Hero className="is-flex-start">
          <Content>
            <Title color={styles.white}>{product.name}</Title>
            <p>{product.category}</p>
            <Subtitle color={styles.whiteLight} dangerouslySetInnerHTML={{ __html: product.description }}></Subtitle>
          </Content>
        </Hero>
        <ProductContainer>
          <Title>Hey</Title>
        </ProductContainer>
      </Container>
    </Main>
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
