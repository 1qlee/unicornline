import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles"

const StyledTableOfContents = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
`

const TocGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`

const TocLink = styled.p`
  display: inline-block;
  position: relative;
  &::before {
    content: "";
    width: 100%;
    position: absolute;
    height: 0;
    background: ${styles.primary.light};
    opacity: 0.4;
    bottom: 2px;
    left: 0;
    transition: height 0.2s;
  }
  &:hover {
    &::before {
      height: 6px;
    }
  }
`

const TocHeader = styled.h3`
  background-color: ${styles.primary.normal};
  font-family: "Alata";
  font-weight: 400;
  color: ${styles.white.normal};
  padding: 0.5rem;
  position: relative;
  margin-left: -0.5rem;
  margin-bottom: 1rem;
  min-width: 100px;
  transition: padding 0.2s, background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  &:hover {
    background-color: ${styles.primary.dark};
    box-shadow: 0 2px 6px ${styles.shadow};
    transform: translateY(-1px);
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    &::before {
      opacity: 1;
      transform: translateX(-1rem);
    }
  }
  &:active {
    transform: translateY(0);
  }
  &::before {
    content: "\u2192";
    position: absolute;
    right: 0;
    transform: translateX(-1.5rem);
    top: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
  }
`

export default () => (
  <StaticQuery
    query={graphql`
      query tocQuery {
        allDatoCmsCategory(sort: {fields: [name], order: ASC}) {
          edges {
            node {
              id
              name
              description
              photo {
                url
                alt
              }
            }
          }
        }
        allDatoCmsProduct(sort: {fields: [name], order: ASC}) {
          edges {
            node {
              id
              name
              category
              slug
            }
          }
        }
      }
    `}
    render={data => (
      <StyledTableOfContents>
        {data.allDatoCmsCategory.edges.map(({ node: category }) => (
          <TocGroup key={category.id}>
            <Link to={"/" + category.name.toLowerCase()}>
              <TocHeader>{category.name}</TocHeader>
            </Link>
            {data.allDatoCmsProduct.edges.map(({ node: product }) => (
              <>
                {product.category === category.name ? (
                  <Link key={product.id} to={"/" + product.category.toLowerCase() + "/" + product.slug} style={{color:"grey"}}>
                    <TocLink>{product.name}</TocLink>
                  </Link>
                ) : (
                  null
                )}
              </>
            ))}
          </TocGroup>
        ))}
      </StyledTableOfContents>
    )}
    />
)
