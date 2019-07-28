import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { CardContainer, Card, CardImage } from "../components/card"
import { Content} from "../components/content"
import { Hero, HeroContent } from "../components/hero"
import { Title } from "../components/title"
import Footer from "../components/footer"
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
        <Content className="fade-in-down" style={{maxWidth:"525px"}}>
          <Title color={styles.white.normal} fontSize="4rem" fontWeight="400">Unicorn Line</Title>
        </Content>
        <Footer />
      </HeroContent>
      <CardContainer>
        {data.allDatoCmsCategory.edges.map(({node: category}) => (
          <Card key={category.name}>
            <Link key={category.name} to={`/${category.name.toLowerCase()}`}>
              <CardImage src="https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80" alt="Dummy" />
              <Content className="is-card" style={{padding:"1rem"}}>
                <h3 style={{fontFamily: "Karla", fontWeight:"700", pointerEvents: "none"}}>{category.name}</h3>
                <p style={{pointerEvents: "none"}}>{category.description}</p>
              </Content>
            </Link>
          </Card>
        ))}
      </CardContainer>
    </Hero>
  </Main>
)

export const query = graphql`
  query IndexQuery {
    datoCmsCompany {
      logoLine {
        alt
        url
      }
    }
    allDatoCmsCategory {
      edges {
        node {
          id
          name
          description
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
