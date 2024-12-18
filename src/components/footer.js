import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { Content } from "./content"
import styles from "../css/styles.js"

const Footer = styled.div`
  animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: ${styles.grey.dark};
  padding: 6rem 2rem;
`

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  padding: 0 1rem;
  margin: 0 auto;
  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`

const FooterSection = styled.section`
  display: flex;
  margin-right: 1rem;
  flex: 0.5;
  @media only screen and (max-width: 920px) {
    flex-direction: column;
  }
  @media only screen and (max-width: 600px) {
    margin-bottom: 1rem;
    &:not(:last-child) {
      margin-right: 0;
    }
  }
`

const FooterTitle = styled.h3`
  font-size: ${props => props.fontSize ? props.fontSize : "1rem"};
  color: ${props => props.color ? props.color : styles.white.normal};
  text-transform: ${props => props.textTransform ? props.textTransform : "none"};
  font-family: ${props => props.fontFamily ? props.fontFamily : null};
  font-weight: ${props => props.fontWeight ? props.fontWeight : "700"};
  margin-bottom:  ${props => props.marginBottom ? props.marginBottom : "0"};
`

const FooterColumn = styled.div`
  p {
    color: ${styles.white.normal};
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
  @media only screen and (max-width: 920px) {
    &:not(:last-child) {
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
`

const FooterLink = styled.a`
  color: ${styles.white.normal};
  display: inline-block;
  position: relative;
  z-index: 1;
  &:hover {
    &::before {
      width: 100%;
    }
  }
  &::before {
    content: "";
    position: absolute;
    background: ${styles.primary.normal};
    left: 0;
    bottom: -4px;
    height: 3px;
    width: 0;
    transition: width 0.2s ease;
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
        <FooterContainer>
          <FooterSection>
            <FooterColumn>
              <FooterTitle fontWeight="400" color={styles.white.normal} fontSize="2rem">Unicorn Line</FooterTitle>
              <p style={{color: styles.grey.normal}}>A Unicorn Graphics website.</p>
            </FooterColumn>
          </FooterSection>
          <FooterSection>
            <FooterColumn>
              <Content>
                <FooterTitle marginBottom="1rem" textTransform="uppercase" color={styles.grey.normal} fontSize="0.875rem" fontFamily="Karla">About</FooterTitle>
                <div color={styles.white.normal} fontSize="1.3rem" dangerouslySetInnerHTML={{ __html: data.datoCmsCompany.blurbNode.childMarkdownRemark.html }}></div>
              </Content>
            </FooterColumn>
          </FooterSection>
          <FooterSection className="custom">
            <FooterColumn>
              <Content>
                <FooterTitle marginBottom="1rem" textTransform="uppercase" color={styles.grey.normal} fontSize="0.875rem" fontFamily="Karla">Phone</FooterTitle>
                <p>
                  <FooterLink color={styles.white.normal} background={styles.white.normal} title="Phone" href={"tel:" + data.datoCmsCompany.phone} target="_blank" rel="noopener noreferrer">
                    516-222-0712
                  </FooterLink>
                </p>
              </Content>
              <Content>
                <FooterTitle marginBottom="1rem" textTransform="uppercase" color={styles.grey.normal} fontSize="0.875rem" fontFamily="Karla">Email</FooterTitle>
                <p>
                  <FooterLink color={styles.white.normal} background={styles.white.normal} title="Email" href={"mailto:" + data.datoCmsCompany.email} target="_blank" rel="noopener noreferrer">
                    ny@unicorngraphics.com
                  </FooterLink>
                </p>
              </Content>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle marginBottom="1rem" textTransform="uppercase" color={styles.grey.normal} fontSize="0.875rem" fontFamily="Karla">Address</FooterTitle>
              <FooterLink color={styles.white.normal} background={styles.white.normal} title="Map" href={data.datoCmsCompany.map} target="_blank" rel="noopener noreferrer">
                <div dangerouslySetInnerHTML={{ __html: data.datoCmsCompany.addressNode.childMarkdownRemark.html }}></div>
              </FooterLink>
            </FooterColumn>
          </FooterSection>
        </FooterContainer>
      </Footer>
    )}
  />
)
