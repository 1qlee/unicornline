import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"
import Container from "./container"

const Footer = styled.div`
  color: ${styles.whiteLight};
  background: ${styles.backgroundDark};
  padding: 40px 0;
  .container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
`

const FooterLeft = styled.div`
`

const FooterRight = styled.div`
`

export default () => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        datoCmsFooter {
          company
          about
          phone
        }
      }
    `}
    render={data => (
      <Footer>
        <Container className="container">
          <FooterLeft>
            <p>{data.datoCmsFooter.phone}</p>
            <p>971 Stewart Avenue <br/>Garden City, NY 11530</p>
          </FooterLeft>
          <FooterRight>
            <p>© {data.datoCmsFooter.company}. All rights reserved.</p>
          </FooterRight>
        </Container>
      </Footer>
    )}
  />
)
