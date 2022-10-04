import React from "react"
import styled from "styled-components"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import { Helmet } from "react-helmet"

import { Content } from "../content"
import { Menu, MenuItemWrapper, MenuItem } from "../menu"
import { Hero } from "../hero"
import { Title, Subtitle } from "../title"
import BreadCrumb from "../breadcrumb"
import Main from "../main"
import NavBar from "../nav"

import styles from "../../css/styles"
import favicon from "../../images/favicon.png"
import "../../css/reset.css"
import "../../css/master.css"

const CategoryContainer = styled.div`
  padding: 2rem 0;
  min-height: calc(100% - 219px);
  @media only screen and (max-width: 749px) {
    min-height: calc(100% - 213px);
  }
`

const CategoryPage = ({ data }) => {
  const category = data.datoCmsCategory
  const products = data.allDatoCmsProduct

  return (
    <Main className={category.name.toLowerCase()}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{category.name} - Unicorn Line</title>
        <link rel="canonical" href="https://unicornline.com" />
        <link rel="icon" type="image/png" href={favicon} />
      </Helmet>
      <NavBar />
      <CategoryContainer>
        <Hero className="is-flex-start has-animation">
          <Content>
            <BreadCrumb parent="Home" categoryName={category.name} categorySlug={category.slug} />
            <Title color={styles.text}>{category.name}</Title>
            <Subtitle color={styles.grey.normal}>{category.description}</Subtitle>
          </Content>
        </Hero>
        <Menu className={category.slug.toLowerCase()}>
          {products.edges.map(({ node: product }) => (
            <MenuItemWrapper key={product.id}>
              <Link to={`/${category.slug.toLowerCase()}/${product.slug}`}>
                <MenuItem className="menu-item">
                  {product.thumbnail && (
                    <Img fixed={product.thumbnail.fixed} />
                  )}
                  <Content className="has-text-centered">
                    <p className="label">{product.name}</p>
                  </Content>
                </MenuItem>
              </Link>
            </MenuItemWrapper>
          ))}
        </Menu>
      </CategoryContainer>
    </Main>
  )
}

export default CategoryPage

export const query = graphql`
  query CategoryQuery($category: String!, $slug: String!) {
    datoCmsCategory(slug: { eq: $slug }) {
      name
      description
      slug
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
          thumbnail {
            fixed(width: 200, height: 150, imgixParams: { fm: "png", auto: "compress" }) {
              ...GatsbyDatoCmsFixed
            }
          }
        }
      }
    }
  }
`
