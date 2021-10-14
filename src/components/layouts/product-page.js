import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Content } from "../content"
import { Hero } from "../hero"
import { Table, TableLegend, TableHead, TableBody, TableData, Droplet } from "../table"
import { Title, Subtitle } from "../title"
import { ButtonTray, Button } from "../button"
import ProductImages from "../productimages"
import BreadCrumb from "../breadcrumb"
import Main from "../main"
import NavBar from "../nav"

import styles from "../../css/styles"
import favicon from "../../images/favicon.png"
import "../../css/reset.css"
import "../../css/master.css"

const ProductContainer = styled.div`
  display: flex;
  padding: 2rem 0;
  width: 100%;
  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`

const ProductLeft = styled.div`
  padding: 1rem;
  width: 600px;
  @media only screen and (max-width: 1200px) {
    margin: 0 auto;
    width: 400px;
  }
  @media only screen and (max-width: 400px) {
    margin: 0 auto;
    width: 300px;
  }
`

const ProductRight = styled.div`
  animation: fadeInRight 0.6s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 0 1rem 2rem;
  width: calc(100% - 600px);
  @keyframes fadeInRight {
    0% {
      opacity: 0;
      transform: translateX(-30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @media only screen and (max-width: 1200px) {
    display: flex;
    flex-direction: column;
    padding: 0 95px;
    width: auto !important;
  }
  @media only screen and (max-width: 845px) {
    padding: 0 2rem 2rem;
  }
  @media only screen and (max-width: 730px) {
    padding: 0 1rem 2rem;
  }
  @media only screen and (max-width: 650px) {
    padding: 0 0 2rem;
  }
`

const ProductInfo = styled.div`
  padding: 1rem;
  position: relative;
  overflow-x: hidden;
  h3 {
    color: black;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }
  li {
    color: ${styles.grey.normal};
    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
`

const Columns = styled.div`
  display: flex;
  @media only screen and (max-width: 1425px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`

const Column = styled.div`
  &:first-child {
    margin-right: 2rem;
    @media only screen and (max-width: 1425px) {
      width: 100%;
      margin-top: 1.5rem;
      margin-right: 0;
    }
  }
  &:nth-child(2) {
    width: calc(100% - 400px);
    @media only screen and (max-width: 1425px) {
      width: 100%;
    }
  }
`

const Whole = styled.div`
  display: flex;
`

const Half = styled.div`
  width: 50%;
  &:not(:last-child) {
    margin-right: 1rem;
  }
`

export default ({ data }) => {
  const product = data.datoCmsProduct
  const { specs } = product
  const { helperNode } = product
  const { pricing } = product
  const { images } = product
  const { thumbnail } = product
  const { template } = product
  const { catalogPage } = product
  const { fullCatalog } = product
  const { videos } = product
  const category = product.category.toLowerCase()

  return (
    <Main className={category}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{product.name} - Unicorn Line</title>
        <link rel="canonical" href="https://unicornline.com" />
        <link rel="icon" type="image/png" href={favicon} />
      </Helmet>
      <NavBar />
      <ProductContainer>
        <ProductLeft>
          <ProductImages images={images} thumbnails={thumbnail}/>
          {helperNode.childMarkdownRemark.html ? (
            <Content className="is-helper" dangerouslySetInnerHTML={{ __html: data.datoCmsProduct.helperNode.childMarkdownRemark.html}}>
            </Content>
          ) : (
            null
          )}
        </ProductLeft>
        <ProductRight>
          <Hero>
            <Content>
              <BreadCrumb parent="Home" category={product.category} product={product.name} slug={product.slug}></BreadCrumb>
              <Title color={styles.text}>{product.name}</Title>
              <Subtitle style={{maxWidth: "750px"}} color={styles.grey.normal} fontSize="1.3rem">{product.description}</Subtitle>
            </Content>
          </Hero>
          <ButtonTray>
            {template ? (
              <Button href={template.url} target="_blank" rel="noopener noreferrer">Template</Button>
            ) : (
              null
            )}
            {catalogPage ? (
              <Button href={catalogPage.url} target="_blank" rel="noopener noreferrer">Catalog Page</Button>
            ) : (
              null
            )}
            {fullCatalog ? (
              <Button href={fullCatalog.url} target="_blank" rel="noopener noreferrer">Full Catalog</Button>
            ) : (
              null
            )}
          </ButtonTray>
          <ProductInfo>
            <Columns>
              <Column>
                <Whole>
                  <Half>
                    {specs.list ? (
                      <Content>
                        <h3 className={category}>Specifications</h3>
                        <ul>
                          {specs.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </Content>
                    ) : (
                      null
                    )}
                    {specs.material ? (
                      <Content>
                        <h3 className={category}>Materials</h3>
                        <ul>
                          {specs.material.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </Content>
                    ) : (
                      null
                    )}
                  </Half>
                  <Half>
                    {specs.printing ? (
                      <Content>
                        <h3 className={category}>Printing</h3>
                        <ul>
                          {specs.printing.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </Content>
                    ) : (
                      null
                    )}
                    {specs.custom ? (
                      <Content>
                        <h3 className={category}>Custom Shape</h3>
                        <ul>
                          <li>{specs.custom}</li>
                        </ul>
                      </Content>
                    ) : (
                      null
                    )}
                    {specs.option ? (
                      <Content>
                        <h3 className={category}>Options</h3>
                        <ul>
                          {specs.option.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </Content>
                    ) : (
                      null
                    )}
                  </Half>
                </Whole>
                <div style={{marginTop:"1rem"}}>
                  {videos ? (
                    <>
                      {videos.uids.map(uid => (
                        <iframe
                          allowfullscreen="allowfullscreen"
                          mozallowfullscreen="mozallowfullscreen"
                          msallowfullscreen="msallowfullscreen"
                          oallowfullscreen="oallowfullscreen"
                          webkitallowfullscreen="webkitallowfullscreen"
                          height="300" src={"https://www.youtube.com/embed/" + uid}>
                        </iframe>
                      ))}
                    </>
                  ) : (
                    null
                  )}
                </div>
              </Column>
              <Column>
                {pricing ? (
                  <div>
                    <h3 className={category} style={{marginBottom: "1rem"}}>Pricing</h3>
                    <Table>
                      {pricing.legend ? (
                        <TableLegend>
                          <tr>
                            {pricing.legend.map((value) => {
                              if (value === "Digital") {
                                return (
                                  <th key={value} className="digital-legend">
                                    <Droplet role="img" aria-label="digital" color={styles.digital}>&#128167;</Droplet>
                                    Digital
                                  </th>
                                )
                              }
                              else if (value === "Offset") {
                                return (
                                  <th key={value} className="offset-legend">
                                    <Droplet role="img" aria-label="offset" color={styles.offset}>&#128167;</Droplet>
                                    Offset
                                  </th>
                                )
                              }
                              else if (value === "Inkjet") {
                                return (
                                  <th key={value} className="inkjet-legend">
                                    <Droplet role="img" aria-label="inkjet" color={styles.inkjet}>&#128167;</Droplet>
                                    Inkjet
                                  </th>
                                )
                              }
                              else {
                                return (
                                  <th key={value}>{value}</th>
                                )
                              }
                            })}
                          </tr>
                        </TableLegend>
                      ) : (
                        null
                      )}
                      <TableHead>
                        {pricing.headings ? (
                          <tr>
                            {pricing.headings.map((heading) => {
                              if (heading.substring(0,7) === 'digital') {
                                return (
                                  <th key={heading} className="digital">{heading.substring(7)}</th>
                                )
                              }
                              else if (heading.substring(0,6) === 'offset') {
                                return (
                                  <th key={heading} className="offset">{heading.substring(6)}</th>
                                )
                              }
                              else if (heading.substring(0,6) === 'inkjet') {
                                return (
                                  <th key={heading} className="inkjet">{heading.substring(6)}</th>
                                )
                              }
                              else {
                                return (
                                  <th key={heading}>{heading}</th>
                                )
                              }
                            })}
                          </tr>
                        ) : (
                          null
                        )}
                      </TableHead>
                      {pricing.values ? (
                        <TableBody>
                          {pricing.values.map((value) => (
                            <tr key={value}>
                              {value.map((data, index) => (
                                <TableData key={index}>{data}</TableData>
                              ))}
                            </tr>
                          ))}
                        </TableBody>
                      ) : (
                        null
                      )}
                    </Table>
                  </div>
                ) : (
                  null
                )}
              </Column>
            </Columns>
          </ProductInfo>
        </ProductRight>
      </ProductContainer>
    </Main>
  )
}

export const query = graphql`
  query ProductQuery($slug: String!) {
    datoCmsProduct(slug: { eq: $slug }) {
      name
      category
      slug
      description
      template {
        url
      }
      catalogPage {
        url
      }
      fullCatalog {
        url
      }
      helperNode {
        childMarkdownRemark {
          html
          rawMarkdownBody
        }
      }
      images {
        url
        alt
        fluid(maxWidth: 600) {
          ...GatsbyDatoCmsFluid
        }
      }
      specs
      pricing
      videos
    }
  }
`
