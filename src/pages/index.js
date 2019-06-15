import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { CardImage } from "../components/image"
import { Card, CardButton, CardFooter } from "../components/card"
import { Columns, Column } from "../components/columns"
import { Content} from "../components/content"
import { Subtitle } from "../components/title"
import Footer from "../components/footer"
import Hero from "../components/hero"
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
    <Hero className="is-index">
      <Columns>
        <Column className="index-col-1">
          <Content className="fade-in-down" style={{maxWidth:"525px"}}>
            <img src={data.datoCmsCompany.logoLine.url} style={{marginBottom: "2rem"}}/>
            <Subtitle color={styles.white.normal} fontSize="1.3rem" dangerouslySetInnerHTML={{ __html: data.datoCmsIndex.blurbNode.childMarkdownRemark.html }}></Subtitle>
          </Content>
          <Footer />
        </Column>
        <Column className="index-col-2">
          <Slider>
            {data.allDatoCmsCategory.edges.map(({node: category}) => (
              <Card key={category.id}>
                <CardImage src={category.photo.url} />
                <Content style={{padding:"1rem"}}>
                  <h3 style={{fontFamily:"Karla", fontWeight:"700", pointerEvents: "none"}}>{category.name}</h3>
                  <p style={{pointerEvents: "none"}}>{category.description}</p>
                </Content>
                <CardFooter>
                  <Link to={`/${category.name.toLowerCase()}`}>
                    <CardButton className="card-button" color={styles.white.normal} background={styles.grey.dark}>
                      <span style={{display:"inline-block"}}>View</span>
                      <span>&#8594;</span>
                    </CardButton>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </Slider>
        </Column>
      </Columns>
    </Hero>
  </Main>
)

export const query = graphql`
  query IndexQuery {
    datoCmsIndex {
      title
      blurbNode {
        childMarkdownRemark {
          html
          rawMarkdownBody
        }
      }
    }
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
          photo {
            id
            url
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
