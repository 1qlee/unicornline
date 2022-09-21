import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles"

const BannerContainer = styled.div`
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  box-shadow: 0 1px 9px ${styles.shadow};
  border: 2px solid ${styles.primary.light};
  overflow-y: hidden;
  overflow-x: auto;
  height: 138px;
  width: 100%;
  h3 {
    font-family: "Alata";
    font-weight: 400;
  }
  p {
    color: ${styles.grey.normal};
  }
  @media only screen and (max-width: 1250px) {
    margin: 0 1rem;
  }
`

const BannerItem = styled.div`
  align-items: center;
  display: flex;
  transition: transform 0.2s;
  padding: 2rem 1rem;
  height: 100%;
  flex: 1;
  min-width: 346px;
  &:hover {
    background-color: ${styles.grey.light};
  }
`

export default () => (
  <StaticQuery
    query={graphql`
      query bannerQuery {
        allDatoCmsBannerproduct(sort: {fields: [name], order: ASC}) {
          edges {
            node {
              id
              name
              description
              slug
              image {
                url
                alt
              }
            }
          }
        }
      }
    `}
    render={data => (
      <BannerContainer>
        {data.allDatoCmsBannerproduct.edges.map(({node: product}) => (
          <BannerItem
            as={Link}
            to={product.slug} 
            key={product.id}
          >
            <div style={{marginRight:"1rem"}}>
              <img style={{height:'60px', width:'60px'}} src={product.image.url} alt={product.image.alt} />
            </div>
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
          </BannerItem>
        ))}
      </BannerContainer>
    )}
    />
)
