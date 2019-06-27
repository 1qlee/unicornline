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
  p {
    color: ${styles.white.normal};
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
`

const FooterLink = styled.a`
  color: ${styles.white.normal};
  display: block;
  position: relative;
  z-index: 1;
  &:hover {
    &::before {
      width: calc(100% + 10px);
    }
  }
  &::before {
    content: "";
    position: absolute;
    background: ${styles.primary.normal};
    left: -5px;
    top: 0;
    height: 100%;
    width: 0;
    transition: width 0.2s ease-in-out;
    z-index: -1;
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
              <FooterLink color={styles.white.normal} background={styles.white.normal} title="Phone" href={"tel:" + data.datoCmsCompany.phone} target="_blank" rel="noopener noreferrer">
                516-222-0712
              </FooterLink>
            </p>
            <p>
              <FooterLink color={styles.white.normal} background={styles.white.normal} title="Email" href={"mailto:" + data.datoCmsCompany.email} target="_blank" rel="noopener noreferrer">
                ny@unicorngraphics.com
              </FooterLink>
            </p>
          </FooterColumn>
          <FooterColumn>
            <FooterLink color={styles.white.normal} background={styles.white.normal} title="Map" href={data.datoCmsCompany.map} target="_blank" rel="noopener noreferrer">
              <div dangerouslySetInnerHTML={{ __html: data.datoCmsCompany.addressNode.childMarkdownRemark.html }}></div>
            </FooterLink>
          </FooterColumn>
        </FooterSection>
      </Footer>
    )}
  />
)
