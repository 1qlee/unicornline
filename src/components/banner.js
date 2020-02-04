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
  margin: 0 1rem;
  overflow: hidden;
  overflow-x: auto;
`

const StyledBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  flex-shrink: 0;
  h3 {
    font-family: "Alata";
    font-weight: 400;
  }
  p {
    color: ${styles.grey.normal};
  }
  .banner-item {
    width: 388px;
  }
`

const BannerItem = styled.div`
  align-items: center;
  display: flex;
  transition: transform 0.2s;
  padding: 2rem 1rem;
  flex: 1;
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
        <StyledBanner>
          {data.allDatoCmsBannerproduct.edges.map(({node: product}) => (
            <Link className="banner-item" to={product.slug} key={product.id}>
              <BannerItem>
                <div style={{marginRight:"1rem"}}>
                  <img style={{height:'60px', width:'60px'}} src={product.image.url} alt={product.image.alt} />
                </div>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
              </BannerItem>
            </Link>
          ))}
        </StyledBanner>
      </BannerContainer>
    )}
    />
)
