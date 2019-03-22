import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"

const Footer = styled.div`
  display: flex;
  padding-top: 2rem;
  @media only screen and (max-width: 665px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const FooterColumn = styled.div`
  &:not(:last-child) {
    margin-right: 2rem;
  }
`

const FooterHeader = styled.h3`
  font-weight: 700;
  font-size: 1rem;
  font-family: "Karla";
  margin-bottom: 1rem;
`

const FooterContent = styled.div`
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

export default () => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        datoCmsFooter {
          company
          about
          phone
          email
          addressNode {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    `}
    render={data => (
      <Footer>
        <FooterColumn>
          <FooterHeader>{data.datoCmsFooter.company}</FooterHeader>
          <FooterContent>
            <div dangerouslySetInnerHTML={{ __html: data.datoCmsFooter.addressNode.childMarkdownRemark.html }}></div>
          </FooterContent>
        </FooterColumn>
        <FooterColumn>
          <FooterContent>
            <FooterHeader>Telephone</FooterHeader>
            <p>{data.datoCmsFooter.phone}</p>
          </FooterContent>
          <FooterContent>
            <FooterHeader>Email</FooterHeader>
            <a href="mailto:jason@unicorngraphics.com">{data.datoCmsFooter.email}</a>
          </FooterContent>
        </FooterColumn>
      </Footer>
    )}
  />
)
