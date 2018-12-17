import React from "react"
import { graphql } from "gatsby"
import Main from "../components/main"
import NavBar from "../components/nav"
import {Title, Subtitle} from "../components/title"
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
        <Title className="has-line fade-in-down" color={styles.grey.text}>{data.datoCmsIndex.title}</Title>
        <Subtitle className="fade-in-down" color={styles.grey.title}>{data.datoCmsIndex.subtitle}</Subtitle>
        <Products />
      </Content>
      <Footer />
    </Hero>
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
