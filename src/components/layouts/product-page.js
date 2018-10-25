import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"

import Main from "../main"
import Content from "../content"
import NavBar from "../nav"
import Hero from "../hero"
import {Title, Subtitle} from "../title"
import BreadCrumb from "../breadcrumb"

import styles from "../../css/styles"

import "../../css/reset.css"
import "../../css/master.css"

const ProductContainer = styled.div`
  border-radius: 12px;
  width: 100%;
  height: 100%;
  padding: 1rem;
`

export default ({ data }) => {
  const product = data.datoCmsProduct

  return (
    <Main>
      <NavBar />
      <Hero className="is-flex-start">
        <Content>
          <BreadCrumb parent="Home" category={product.category} product={product.name}></BreadCrumb>
          <Title color={styles.white}>{product.name}</Title>
          <Subtitle color={styles.whiteLight} dangerouslySetInnerHTML={{ __html: product.description }}></Subtitle>
        </Content>
      </Hero>
      <ProductContainer>
        <Title>Hey</Title>
      </ProductContainer>
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
