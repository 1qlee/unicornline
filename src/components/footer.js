import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"

const Footer = styled.div`
  align-items: flex-end;
  color: ${styles.grey.text};
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  @media only screen and (max-width: 665px) {
    flex-direction: column;
    align-items: flex-start;
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
        <FooterLeft>
          <p>{data.datoCmsFooter.phone}</p>
          <p>971 Stewart Avenue <br/>Garden City, NY 11530</p>
        </FooterLeft>
        <FooterRight>
          <p>© {data.datoCmsFooter.company}. All rights reserved.</p>
        </FooterRight>
      </Footer>
    )}
  />
)
