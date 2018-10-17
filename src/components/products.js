import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"
import Content from "./content"
import Container from "./container"

const ProductsContainer = styled.div`
  background: ${styles.backgroundLight};
  flex-grow: 1;
  padding-top: 120px;
  .container {
    display: flex;
    align-items: center;
  }
`

const ProductCard = styled.div`
  &:not(:last-child) {
    margin-right: 1rem;
  }
`

const ProductCardHeader = styled.div`
  img {
    display: block;
    height: auto;
    width: 200px;
  }
`

const ProductCardContent = styled.div`
  padding: 1rem 0;
`

export default () => (
  <StaticQuery
    query={graphql`
      query ProductsQuery {
        allDatoCmsCategory(sort: {fields: [id], order: ASC}) {
          edges {
            node {
              name
              description
            }
          }
        }
      }
    `}
    render={data => (
      <ProductsContainer>
        <Container className="container">
          {data.allDatoCmsCategory.edges.map(({node}) => (
          <ProductCard key={node.id}>
            <ProductCardHeader>

            </ProductCardHeader>
            <ProductCardContent>
              <Content>
                <h3>{node.name}</h3>
                <p>{node.description}</p>
              </Content>
            </ProductCardContent>
          </ProductCard>
          ))}
        </Container>
      </ProductsContainer>
    )}
  />
)
