import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Content} from "../components/content"
import { Hero, HeroContent } from "../components/hero"
import { Title } from "../components/title"
import CardMenu from "../components/card"
import Main from "../components/main"
import NavBar from "../components/nav"

import styles from "../css/styles"
import favicon from "../images/favicon.png"
import "../css/reset.css"
import "../css/master.css"

export default ({ data }) => (
  <Main className="index is-flex-center">
    <Helmet>
      <meta charSet="utf-8" />
      <title>Unicorn Line</title>
      <link rel="canonical" href="https://unicornline.com" />
      <link rel="icon" type="image/png" href={favicon} />
    </Helmet>
    <NavBar />
    <Hero>
      <HeroContent>
        <Content className="is-flex fade-in-down">
          <Title marginBottom="2rem" color={styles.white.normal} fontSize="4rem" fontWeight="400">Unicorn Line</Title>
        </Content>
      </HeroContent>
      <CardMenu categories={data.allDatoCmsCategory.edges}/>
    </Hero>
  </Main>
)

export const query = graphql`
  query IndexQuery {
    allDatoCmsCategory {
      edges {
        node {
          id
          name
          description
          photo {
            url
            alt
          }
        }
      }
    }
    allDatoCmsProduct {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
