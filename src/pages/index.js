import React from "react"
import { graphql } from "gatsby"
import {Columns, Column} from "../components/columns"
import {Content} from "../components/content"
import {Title, Subtitle} from "../components/title"
import Footer from "../components/footer"
import Hero from "../components/hero"
import Main from "../components/main"
import NavBar from "../components/nav"
import Products from "../components/products"

import styles from "../css/styles"

import "../css/reset.css"
import "../css/master.css"

export default ({ data }) => (
  <Main className="is-flex-center">
    <NavBar />
    <Hero>
      <Columns>
        <Column width={"50%"}>
          <Content>
            <Title className="fade-in-down" color={styles.grey.dark}>{data.datoCmsIndex.title}</Title>
            <Subtitle className="fade-in-down" color={styles.primary.normal}>{data.datoCmsIndex.blurb}</Subtitle>
          </Content>
        </Column>
        <Column width={"50%"}>
          <Products />
        </Column>
      </Columns>
    </Hero>
    <Footer />
  </Main>
)

export const query = graphql`
  query IndexQuery {
    datoCmsIndex {
      title
      subtitle
      blurb
    }
  }
`
