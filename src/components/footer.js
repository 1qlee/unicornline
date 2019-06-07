import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Icon from "./icon"
import styled from "styled-components"
import styles from "../css/styles.js"

import Envelope from "../../assets/envelope.svg"
import Map from "../../assets/map.svg"
import Phone from "../../assets/phone.svg"

const Footer = styled.div`
  animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: ${styles.primary.normal};
  border-radius: 8px;
  display: inline-flex;
  padding: 0.5rem;
`

const FooterColumn = styled.div`
  &:not(:last-child) {
    margin-right: 1rem;
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
          map
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
          <Icon color={styles.white.normal} background={styles.primary.normal} href={"mailto:" + data.datoCmsFooter.email} target="_blank" referrer="noreferrer">
            <Envelope style={{fill:styles.white.normal}}/>
          </Icon>
        </FooterColumn>
        <FooterColumn>
          <Icon color={styles.white.normal} background={styles.primary.normal} href={data.datoCmsFooter.map} target="_blank" referrer="noreferrer">
            <Map style={{fill:styles.white.normal}}/>
          </Icon>
        </FooterColumn>
        <FooterColumn>
          <Icon color={styles.white.normal} background={styles.primary.normal} href={"tel:" + data.datoCmsFooter.phone} target="_blank" referrer="noreferrer">
            <Phone style={{fill:styles.white.normal}}/>
          </Icon>
        </FooterColumn>
      </Footer>
    )}
  />
)
