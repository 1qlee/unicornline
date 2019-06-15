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
  background: ${styles.white.normal};
  border-radius: 8px;
  display: inline-flex;
  margin-top: 2rem;
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
        }
      }
    `}
    render={data => (
      <Footer>
        <FooterColumn>
          <Icon color={styles.white.normal} background={styles.white.normal} title="Email" href={"mailto:" + data.datoCmsCompany.email} target="_blank" referrer="noreferrer">
            <Envelope style={{fill:styles.grey.dark}}/>
          </Icon>
        </FooterColumn>
        <FooterColumn>
          <Icon color={styles.white.normal} background={styles.white.normal} title="Map" href={data.datoCmsCompany.map} target="_blank" referrer="noreferrer">
            <Map style={{fill:styles.grey.dark}}/>
          </Icon>
        </FooterColumn>
        <FooterColumn>
          <Icon color={styles.white.normal} background={styles.white.normal} title="Phone" href={"tel:" + data.datoCmsCompany.phone} target="_blank" referrer="noreferrer">
            <Phone style={{fill:styles.grey.dark}}/>
          </Icon>
        </FooterColumn>
      </Footer>
    )}
  />
)
