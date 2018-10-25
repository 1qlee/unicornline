import React from "react"
import { graphql } from "gatsby"
import Main from "../components/main"
import NavBar from "../components/nav"
import {Title, Subtitle} from "../components/title"
import Content from "../components/content"
import Hero from "../components/hero"
import Footer from "../components/footer"
import Products from "../components/products"

import styles from "../css/styles"

import "../css/reset.css"
import "../css/master.css"

export default ({ data }) => (
  <Main>
    <NavBar />
    <Hero>
      <Content className="has-text-centered">
        <Title color={styles.white}>{data.datoCmsIndex.title}</Title>
        <Subtitle color={styles.whiteLight}>{data.datoCmsIndex.subtitle}</Subtitle>
        <Products />
      </Content>
    </Hero>
    <Footer />
  </Main>
)

export const query = graphql`
  query IndexQuery {
    datoCmsIndex {
      title
      subtitle
    }
  }
`
