import React from "react"
import { graphql } from "gatsby"
import {Content} from "../content"
import {Table, TableHead, TableData} from "../table"
import {Title, Subtitle} from "../title"
import {ImageContainer, ImageComponent} from "../image"
import BreadCrumb from "../breadcrumb"
import Hero from "../hero"
import Main from "../main"
import NavBar from "../nav"
import styled from "styled-components"

import styles from "../../css/styles"

import "../../css/reset.css"
import "../../css/master.css"

const ProductContainer = styled.div`
  display: flex;
  width: 100%;
`

const ProductLeft = styled.div`
  padding: 1rem;
  width: 30%;
`

const ProductRight = styled.div`
  animation: fadeInRight 0.4s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 0 1rem 2rem;
  width: 70%;
  li {
    color: ${styles.grey.text};
  }
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
`

const ProductInfo = styled.div`
  margin-top: 2rem;
  position: relative;
  overflow-x: hidden;
  h3 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: "Karla";
    font-weight: 700;
  }
`

const Divider = styled.hr`
  background: ${styles.grey.normal};
  margin-bottom: 1.5rem;
  height: 3px;
`

const Columns = styled.div`
  display: flex;
`

const Column = styled.div`
  &:first-child {
    margin-right: 1rem;
    width: 450px;
  }
`

export default ({ data }) => {
  const product = data.datoCmsProduct
  const {specs} = product
  const {pricing} = product
  const {images} = product

  return (
    <Main>
      <NavBar />
      <ProductContainer>
        <ProductLeft>
          <ImageContainer>
            {images.map((item) => (
              <p>{item.url}</p>
            ))}
            <ImageComponent images={images.url} />
          </ImageContainer>
        </ProductLeft>
        <ProductRight>
          <Hero className="is-flex-start no-side-padding">
            <Content>
              <BreadCrumb parent="Home" category={product.category} product={product.name} slug={product.slug}></BreadCrumb>
              <Title color={styles.grey.text}>{product.name}</Title>
              <Subtitle style={{maxWidth: "750px"}} color={styles.grey.normal} fontSize="1.1rem">{product.description}</Subtitle>
            </Content>
          </Hero>
          <ProductInfo>
            <Columns>
              <Column>
                <Content>
                  <h3>Specifications</h3>
                  <ul>
                    {specs.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Content>
                <Content>
                  <h3>Materials</h3>
                  <ul>
                    {specs.material.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Content>
                <Content>
                  <h3>Printing</h3>
                  <ul>
                    {specs.printing.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Content>
                {specs.custom ? (
                  <Content>
                    <h3>Custom Shape</h3>
                    <ul>
                      <li>{specs.custom}</li>
                    </ul>
                  </Content>
                ) : (
                  null
                )}
                <Content>
                  <h3>Option</h3>
                  <ul>
                    {specs.option.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Content>
              </Column>
              {pricing ? (
                <Column>
                  <Content>
                    <h3>Pricing</h3>
                  </Content>
                  <Table>
                    <TableHead>
                      {pricing.legend ? (
                        <tr>
                          {pricing.legend.map((value) => {
                            if (value === "Digital") {
                              return (
                                <th key={value} className="digital-legend">Digital</th>
                              )
                            }
                            else if (value === "Offset") {
                              return (
                                <th key={value} className="offset-legend">Offset</th>
                              )
                            }
                            else if (value === "Inkjet") {
                              return (
                                <th key={value} className="inkjet-legend">Inkjet</th>
                              )
                            }
                            else {
                              return (
                                <th key={value}>{value}</th>
                              )
                            }
                          })}
                        </tr>
                      ) : (
                        null
                      )}
                      {pricing.headings ? (
                        <tr>
                          {pricing.headings.map((heading) => {
                            if (heading.substring(0,6) === 'offset') {
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
                                <th key={heading} className="digital">{heading}</th>
                              )
                            }
                          })}
                        </tr>
                      ) : (
                        null
                      )}
                    </TableHead>
                    {pricing.values ? (
                      <tbody>
                        {pricing.values.map((value) => (
                          <tr key={value}>
                            {value.map((data) => (
                              <TableData key={data}>{data}</TableData>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      null
                    )}
                  </Table>
                </Column>
              ) : (
                null
              )}
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
      images {alt, id, title, url}
      specs {list, material, printing, custom, option}
      pricing {legend, headings, values}
    }
  }
`
