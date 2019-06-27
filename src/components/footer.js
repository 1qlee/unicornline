import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"

const Footer = styled.div`
  animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  justify-content: space-between;
`

const FooterSection = styled.section`
  display: flex;
`

const FooterColumn = styled.div`
  color: ${styles.white.normal};
  &:not(:last-child) {
    margin-right: 1rem;
  }
`

export default () => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        datoCmsCompany {
          company
          about
          phone
          email
          map
          addressNode {
            childMarkdownRemark {
              html
            }
          }
          blurbNode {
            childMarkdownRemark {
              html
              rawMarkdownBody
            }
          }
        }
      }
    `}
    render={data => (
      <Footer>
        <FooterSection>
          <FooterColumn>
            <div color={styles.white.normal} fontSize="1.3rem" dangerouslySetInnerHTML={{ __html: data.datoCmsCompany.blurbNode.childMarkdownRemark.html }}></div>
          </FooterColumn>
        </FooterSection>
        <FooterSection>
          <FooterColumn>
            <p>
              <a color={styles.white.normal} background={styles.white.normal} title="Phone" href={"tel:" + data.datoCmsCompany.phone} target="_blank" rel="noopener noreferrer">
                516-222-0712
              </a>
            </p>
            <p>
              <a color={styles.white.normal} background={styles.white.normal} title="Email" href={"mailto:" + data.datoCmsCompany.email} target="_blank" rel="noopener noreferrer">
                ny@unicorngraphics.com
              </a>
            </p>
          </FooterColumn>
          <FooterColumn>
            <a color={styles.white.normal} background={styles.white.normal} title="Map" href={data.datoCmsCompany.map} target="_blank" rel="noopener noreferrer">
              <div dangerouslySetInnerHTML={{ __html: data.datoCmsCompany.addressNode.childMarkdownRemark.html }}></div>
            </a>
          </FooterColumn>
        </FooterSection>
      </Footer>
    )}
  />
)
