import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Content } from "../content"
import { Table, TableHead, TableData } from "../table"
import { Title, Subtitle } from "../title"
import { ImageContainer, ImageComponent } from "../image"
import BreadCrumb from "../breadcrumb"
import Hero from "../hero"
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
    width: auto;
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
    font-family: "Karla";
    font-weight: 700;
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
    width: 350px;
    @media only screen and (max-width: 1425px) {
      width: 100%;
      margin-top: 1.5rem;
      margin-right: 0;
    }
  }
  &:nth-child(2) {
    width: calc(100% - 350px);
    @media only screen and (max-width: 1425px) {
      width: 100%;
    }
  }
`

export default ({ data }) => {
  const product = data.datoCmsProduct
  const {specs} = product
  const {pricing} = product
  const {images} = product

  return (
    <Main className="product">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Unicorn Line</title>
        <link rel="canonical" href="https://unicornline.com" />
        <link rel="icon" type="image/png" href={favicon} />
      </Helmet>
      <NavBar />
      <ProductContainer>
        <ProductLeft>
          <ImageContainer>
            <ImageComponent images={images} />
            <small style={{background: "white", padding: "5px", position: "absolute", top: "0", fontSize: "10px"}}>Our images are under construction.</small>
          </ImageContainer>
        </ProductLeft>
        <ProductRight>
          <Hero className="is-flex-start">
            <Content>
              <BreadCrumb parent="Home" category={product.category} product={product.name} slug={product.slug}></BreadCrumb>
              <Title fontSize="4rem" fontWeight="400" color={styles.grey.dark}>{product.name}</Title>
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
                                <td key={value} className="digital-legend">Digital</td>
                              )
                            }
                            else if (value === "Offset") {
                              return (
                                <td key={value} className="offset-legend">Offset</td>
                              )
                            }
                            else if (value === "Inkjet") {
                              return (
                                <td key={value} className="inkjet-legend">Inkjet</td>
                              )
                            }
                            else {
                              return (
                                <td key={value}>{value}</td>
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
                      <tbody>
                        {pricing.values.map((value) => (
                          <tr key={value}>
                            {value.map((data, index) => (
                              <TableData key={index}>{data}</TableData>
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
