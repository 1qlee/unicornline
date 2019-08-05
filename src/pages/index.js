import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { CardContainer, CardContent, Card, CardImage } from "../components/card"
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
        <Content className="fade-in-down">
          <Title align="center" marginBottom="2rem" color={styles.white.normal} fontSize="4rem" fontWeight="400">Unicorn Line</Title>
        </Content>
      </HeroContent>
      <CardContainer>
        {data.allDatoCmsCategory.edges.map(({node: category}) => (
          <Card key={category.name}>
            <Link key={category.name} to={`/${category.name.toLowerCase()}`}>
              <CardImage src="https://images.unsplash.com/photo-1554757387-fa0367573d09?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=400&fit=crop&ixid=eyJhcHBfaWQiOjF9" alt="Dummy" />
              <CardContent>
                <Content>
                  <h3 style={{fontFamily: "Karla", fontWeight:"700", pointerEvents: "none"}}>{category.name}</h3>
                  <p style={{pointerEvents: "none"}}>{category.description}</p>
                </Content>
              </CardContent>
            </Link>
          </Card>
        ))}
      </CardContainer>
    </Hero>
    <Footer />
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
