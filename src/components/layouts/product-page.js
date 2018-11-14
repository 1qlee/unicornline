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
  padding: 2rem;
  width: 30%;
`

const ProductRight = styled.div`
  animation: fadeInRight 0.4s both ease-in-out;
  padding: 0 2rem;
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

const ProductInfoTab = styled.ul`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  p {
    background: ${styles.grey.light};
    color: ${styles.text};
    flex-grow: 1;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 0.5rem;
    text-transform: uppercase;
    text-align: center;
    &.is-active {
      background: ${styles.primary.normal};
      color: ${styles.white};
    }
    &:hover {
      cursor: pointer;
      &:not(.is-active) {
        background: ${styles.grey.hover};
      }
    }
  }
`

const ProductInfo = styled.div`
  position: relative;
`

const Columns = styled.div`
  display: flex;
`

const Column = styled.div`
  width: 50%;
  &:first-child {
    margin-right: 1rem;
  }
  h3 {
    font-size: 1.1rem;
  }
`

class ProductRightContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPricing: false,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (event) => {
    if (event.target.classList.contains("is-active")) {
      return null
    }
    this.setState({
      showPricing: this.state.showPricing ? false : true
    })
  }

  render() {
    return (
      <div>
        {this.state.showPricing ? (
          <ProductInfo>
            <ProductInfoTab>
              <p onClick={this.handleClick}>Information</p>
              <p onClick={this.handleClick} className="is-active">Pricing</p>
            </ProductInfoTab>
            {this.props.pricing ? (
              <Table>
                <TableHead>
                  <tr>
                    {this.props.pricing.headings.map((heading) => (
                      <th key={heading}>{heading}</th>
                    ))}
                  </tr>
                </TableHead>
                <tbody>
                  {this.props.pricing.values.map((value) => (
                    <tr key={value}>
                      {value.map((data) => (
                        <TableData key={data}>{data}</TableData>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              null
            )}
          </ProductInfo>
        ) : (
          <ProductInfo>
            <ProductInfoTab>
              <p onClick={this.handleClick} className="is-active">Information</p>
              <p onClick={this.handleClick}>Pricing</p>
            </ProductInfoTab>
            <Columns>
              <Column>
                <Content>
                  <h3>Specifications</h3>
                  <ul>
                    {this.props.specs.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Content>
                <Content>
                  <h3>Materials</h3>
                  <ul>
                    {this.props.specs.material.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Content>
              </Column>
              <Column>
                <Content>
                  <h3>Printing</h3>
                  <ul>
                    {this.props.specs.printing.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Content>
                {this.props.specs.custom ? (
                  <Content>
                    <h3>Custom Shape</h3>
                    <ul>
                      <li>{this.props.specs.custom}</li>
                    </ul>
                  </Content>
                ) : (
                  null
                )}
                <Content>
                  <h3>Option</h3>
                  <ul>
                    {this.props.specs.option.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Content>
              </Column>
            </Columns>
          </ProductInfo>
        )}
      </div>
    )
  }
}

export default ({ data }) => {
  const product = data.datoCmsProduct
  const {specs} = data.datoCmsProduct
  const {pricing} = data.datoCmsProduct

  return (
    <Main>
      <NavBar />
      <ProductContainer>
        <ProductLeft>
          {product.images.map((image) => (
            <ImageContainer key={image.id}>
              <Image alt={image.alt} src={image.url}/>
            </ImageContainer>
          ))}
        </ProductLeft>
        <ProductRight>
          <Hero className="is-flex-start no-side-padding">
            <Content>
              <BreadCrumb parent="Home" category={product.category} product={product.name}></BreadCrumb>
              <Title color={styles.text}>{product.name}</Title>
              <Subtitle style={{maxWidth: "750px"}} color={styles.grey.text} fontSize="1.1rem">{product.description}</Subtitle>
            </Content>
          </Hero>
          <ProductRightContent specs={specs} pricing={pricing} />
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
