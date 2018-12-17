import React from "react"
import { graphql } from "gatsby"

import Main from "../main"
import {Content} from "../content"
import NavBar from "../nav"
import Hero from "../hero"
import {Title, Subtitle} from "../title"
import {Menu, MenuRow, MenuItem} from "../menu"
import BreadCrumb from "../breadcrumb"

import styles from "../../css/styles"

import "../../css/reset.css"
import "../../css/master.css"

export default ({ data }) => {
  const category = data.datoCmsCategory
  const products = data.allDatoCmsProduct

  return (
    <Main>
      <NavBar />
      <Hero className="is-flex-start has-animation">
        <Content>
          <BreadCrumb parent="Home" category={category.name}></BreadCrumb>
          <Title color={styles.grey.text}>{category.name}</Title>
          <Subtitle color={styles.grey.title}>{category.description}</Subtitle>
        </Content>
      </Hero>
      <Menu>
        {products.edges.map(({ node: product }) => (
          // Slug here is bugged in production
          <MenuRow key={product.id}>
            <MenuItem href={"/" + category.name.substring(0).toLowerCase() + "/" + product.slug}>
              <Content className="has-text-centered">
                <p className="label">{product.name}</p>
              </Content>
            </MenuItem>
          </MenuRow>
        ))}
      </Menu>
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
