import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles"
import Content from "./content"

const ProductsContainer = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: 1200px;
  margin-top: 2rem;
  border: 1px solid ${styles.whiteLight};
`

const ProductCard = styled.a`
  color: ${styles.white};
  cursor: pointer;
  display: block;
  padding: 2rem 1rem;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    background: ${styles.white};
    box-shadow: 0 12px 20px 0 ${styles.shadow};
    color: ${styles.text};
    p {
      color: ${styles.grey};
    }
  }
`

const ProductCardContent = styled.div`
  h3 {
    font-weight: 400;
    text-transform: uppercase;
    font-size: 1rem;
    letter-spacing: 1px;
  }
  p {
    color: ${styles.whiteLight};
  }
`

export default () => (
  <StaticQuery
    query={graphql`
      query ProductsQuery {
        allDatoCmsCategory(sort: {fields: [id], order: ASC}) {
          edges {
            node {
              id
              name
              description
            }
          }
        }
      }
    `}
    render={data => (
      <ProductsContainer>
        {data.allDatoCmsCategory.edges.map(({node}) => (
          <ProductCard key={node.id} href={node.name.substring(0).toLowerCase()}>
            <ProductCardContent>
              <Content>
                <h3>{node.name}</h3>
                <p>{node.description}</p>
              </Content>
            </ProductCardContent>
          </ProductCard>
        ))}
      </ProductsContainer>
    )}
  />
)
