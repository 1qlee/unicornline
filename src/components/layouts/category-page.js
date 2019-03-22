import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Content } from "../content"
import { Menu, MenuItemWrapper, MenuItem } from "../menu"
import { Title, Subtitle } from "../title"
import BreadCrumb from "../breadcrumb"
import Hero from "../hero"
import Main from "../main"
import NavBar from "../nav"

import styles from "../../css/styles"
import favicon from "../../images/favicon.ico"
import "../../css/reset.css"
import "../../css/master.css"

const CategoryContainer = styled.div`
  padding: 2rem 0;
  min-height: calc(100% - 219px);
  @media only screen and (max-width: 749px) {
    min-height: calc(100% - 213px);
  }
`

export default ({ data }) => {
  const category = data.datoCmsCategory
  const products = data.allDatoCmsProduct

  return (
    <Main>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Unicorn Line</title>
        <link rel="canonical" href="https://unicornline.com" />
        <link rel="icon" type="image/x-icon" href={favicon} />
      </Helmet>
      <NavBar />
      <CategoryContainer>
        <Hero className="is-flex-start has-animation">
          <Content>
            <BreadCrumb parent="Home" category={category.name}></BreadCrumb>
            <Title fontSize="4rem" fontWeight="400" color={styles.grey.dark}>{category.name}</Title>
            <Subtitle color={styles.grey.title}>{category.description}</Subtitle>
          </Content>
        </Hero>
        <Menu>
          {products.edges.map(({ node: product }) => (
            <MenuItemWrapper key={product.id}>
              <MenuItem href={"/" + category.name.substring(0).toLowerCase() + "/" + product.slug}>
                <Content className="has-text-centered">
                  <p className="label">{product.name}</p>
                </Content>
              </MenuItem>
            </MenuItemWrapper>
          ))}
        </Menu>
      </CategoryContainer>
    </Main>
  )
}

export const query = graphql`
  query CategoryQuery($category: String!) {
    datoCmsCategory(name: { eq: $category }) {
      name
      description
    }
    allDatoCmsProduct(
      filter: {category: {eq: $category}},
      sort: {fields: [name], order: ASC}
    ) {
      edges {
        node {
          category
          id
          name
          slug
        }
      }
    }
  }
`
