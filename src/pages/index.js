import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Columns, Column } from "../components/columns"
import { Content} from "../components/content"
import { Title, Subtitle } from "../components/title"
import Footer from "../components/footer"
import Hero from "../components/hero"
import Main from "../components/main"
import NavBar from "../components/nav"
import BookImage from "../components/book"

import styles from "../css/styles"
import favicon from "../images/favicon.ico"
import catalogCover from "../images/catalog_cover.jpg"
import "../css/reset.css"
import "../css/master.css"

export default ({ data }) => (
  <Main className="is-flex-center">
    <Helmet>
      <meta charSet="utf-8" />
      <title>Unicorn Line</title>
      <link rel="canonical" href="https://unicornline.com" />
      <link rel="icon" type="image/x-icon" href={favicon} />
    </Helmet>
    <NavBar />
    <Hero className="has-animation has-items-centered">
      <Columns>
        <Column>
          <BookImage image={catalogCover} />
        </Column>
        <Column className="has-items-centered">
          <Content>
            <Title className="fade-in-down" color={styles.grey.dark}>{data.datoCmsIndex.title}</Title>
            <Subtitle style={{ maxWidth: "750px" }} className="fade-in-down" color={styles.grey.title}>{data.datoCmsIndex.blurb}</Subtitle>
          </Content>
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
