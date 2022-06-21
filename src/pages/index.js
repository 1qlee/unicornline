import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Content} from "../components/content"
import { Hero, HeroContent } from "../components/hero"
import { Title } from "../components/title"
import Main from "../components/main"
import NavBar from "../components/nav"
import TableOfContents from "../components/tableOfContents"
import Banner from "../components/banner"
import Container from "../components/container"

import styles from "../css/styles"
import favicon from "../images/favicon.png"
import "../css/reset.css"
import "../css/master.css"

const IndexPage = ({ data }) => (
  <Main className="index is-flex-center">
    <Helmet>
      <meta charSet="utf-8" />
      <title>{data.datoCmsCompany.company}</title>
      <link rel="canonical" href="https://unicornline.com" />
      <link rel="icon" type="image/png" href={favicon} />
    </Helmet>
    <NavBar />
    <Container>
      <Hero className="is-index">
        <HeroContent>
          <Content className="fade-in-down">
            <Title color={styles.grey.dark}>{data.datoCmsCompany.company}</Title>
            <p>{data.datoCmsCompany.blurb}</p>
          </Content>
        </HeroContent>
      </Hero>
      <Banner />
      <TableOfContents />
    </Container>
  </Main>
)

export default IndexPage

export const query = graphql`
  query TestQuery {
    datoCmsCompany {
      company
      blurb
    }
    allDatoCmsCategory(sort: {fields: [name], order: ASC}) {
      edges {
        node {
          id
          name
          description
          photo {
            url
            fluid {
              ...GatsbyDatoCmsFluid
            }
          }
        }
      }
    }
  }
`
