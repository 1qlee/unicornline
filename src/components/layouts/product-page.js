import React from "react"
import { graphql } from "gatsby"
import {Content} from "../content"
import {Table, TableHead, TableData} from "../table"
import {Title, Subtitle} from "../title"
import {ImageContainer, Image} from "../image"
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
  padding: 1rem 2rem;
  width: 50%;
  h3 {
    color: ${styles.white};
  }
  p, li {
    color: ${styles.whiteLight};
  }
`

const ProductRight = styled.div`
  padding: 1rem 2rem;
`

export default ({ data }) => {
  const product = data.datoCmsProduct
  const {specs} = data.datoCmsProduct
  const {pricing} = data.datoCmsProduct

  return (
    <Main>
      <NavBar />
      <Hero className="is-flex-start">
        <Content>
          <BreadCrumb parent="Home" category={product.category} product={product.name}></BreadCrumb>
          <Title color={styles.white}>{product.name}</Title>
          <Subtitle color={styles.whiteLight} dangerouslySetInnerHTML={{ __html: product.description }}></Subtitle>
        </Content>
      </Hero>
      <ProductContainer>
        <ProductLeft>
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
              <p>{specs.custom}</p>
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
        </ProductLeft>
        <ProductRight>
          <ImageContainer>
            {product.images.map((image) => (
              <Image alt={image.alt} src={image.url}/>
            ))}
          </ImageContainer>
          <Table>
            <TableHead>
              <tr>
                {pricing.headings.map((heading) => (
                  <th key={heading}>{heading}</th>
                ))}
              </tr>
            </TableHead>
            <tbody>
              {pricing.values.map((value) => (
                <tr key={value}>
                  {value.map((data) => (
                    <TableData key={data}>{data}</TableData>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
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
      description
      images {alt, id, title, url}
      specs {list, material, printing, custom, option}
      pricing {headings, values}
    }
  }
`
