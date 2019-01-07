import React from "react"
import { graphql } from "gatsby"
import Main from "../components/main"
import NavBar from "../components/nav"
import {Title} from "../components/title"
import {Content} from "../components/content"
import Hero from "../components/hero"
import Footer from "../components/footer"
import Products from "../components/products"

import styles from "../css/styles"

import "../css/reset.css"
import "../css/master.css"

export default ({ data }) => (
  <Main className="is-flex-center">
    <Hero>
      <NavBar />
      <Content className="has-text-centered">
        <Title className="has-line fade-in-down" color={styles.grey.text}>{data.datoCmsProduct.pricing.values}</Title>
        <Products />
      </Content>
      <Footer />
    </Hero>
  </Main>
)

export const query = graphql`
  query shitQuery {
    datoCmsProduct(slug: { eq: "golf-ball-boxes" }) {
      name
      category
      description
      images {alt, id, title, url}
      specs {list, material, printing, custom, option}
      pricing {headings, values}
    }
  }
`
