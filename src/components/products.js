import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles"
import {Content} from "./content"

const ProductsContainer = styled.div`
  align-items: center;
  animation: scaleIn 0.6s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid ${styles.primary.normal};
  display: flex;
  flex-direction: column;
  margin: 2rem auto 0;
  max-width: 1200px;
  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.98);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const ProductCard = styled.a`
  color: ${styles.text};
  cursor: pointer;
  display: block;
  padding: 2rem 1rem;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  &:hover {
    background: ${styles.primary.normal};
    box-shadow: 0 12px 20px 0 ${styles.shadow};
    color: ${styles.white.normal};
    p {
      color: ${styles.white.light};
    }
  }
`

const ProductCardContent = styled.div`
  h3 {
    font-weight: 400;
    font-size: 1rem;
    letter-spacing: 1px;
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
