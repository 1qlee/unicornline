import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { CardImage } from "../components/image"
import { Card, CardButton, CardFooter } from "../components/card"
import { Content} from "../components/content"
import { Hero, HeroContent } from "../components/hero"
import { Title } from "../components/title"
import Footer from "../components/footer"
import Main from "../components/main"
import NavBar from "../components/nav"
import Slider from "../components/slider"

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
      <Slider>
        {data.allDatoCmsCategory.edges.map(({node: category}) => (
          <Card key={category.id}>
            <CardImage src="https://dummyimage.com/325x360/d9d9d9/999" alt="Category Image"/>
            <Content style={{padding:"1rem"}}>
              <h3 style={{fontFamily: "Karla", fontWeight:"700", pointerEvents: "none"}}>{category.name}</h3>
              <p style={{pointerEvents: "none"}}>{category.description}</p>
            </Content>
            <CardFooter>
              <Link to={`/${category.name.toLowerCase()}`}>
                <CardButton className="card-button" color={styles.text} background={styles.white.normal}>
                  <span style={{display:"inline-block"}}>View</span>
                  <span>&#8594;</span>
                </CardButton>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </Slider>
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
