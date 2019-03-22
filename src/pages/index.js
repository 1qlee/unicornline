import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Columns, Column } from "../components/columns"
import { Content} from "../components/content"
import { Title } from "../components/title"
import Bar from "../components/bar"
import Box from "../components/box"
import Slider from "../components/slider"
import Footer from "../components/footer"
import Hero from "../components/hero"
import Main from "../components/main"
import NavBar from "../components/nav"

import styles from "../css/styles"
import favicon from "../images/favicon.ico"
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
    <Bar />
    <Hero className="is-index has-animation">
      <Columns>
        <Column style={{padding:"10rem 5rem 0"}}>
          <Content>
            <Title className="fade-in-down" fontSize="4rem" fontWeight="400" color={styles.grey.dark}>{data.datoCmsIndex.title}</Title>
            <div style={{fontSize:"18px", maxWidth:"525px",marginBottom:"2rem"}} dangerouslySetInnerHTML={{ __html: data.datoCmsIndex.blurbNode.childMarkdownRemark.html }}></div>
          </Content>
          <Footer />
        </Column>
        <Column style={{padding:"10rem 0 0 5rem"}}>
          <Slider>
            {data.allDatoCmsCategory.edges.map(({node: category}) => (
              <Box key={category.id} href={`/${category.name.toLowerCase()}`}>
                <img src={category.photo.url} style={{userSelect:"none"}}/>
                <h3 style={{fontFamily:"Karla", fontWeight:"700"}}>{category.name}</h3>
                <p>{category.description}</p>
              </Box>
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
