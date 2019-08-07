import React from "react"
import { Link } from "gatsby"
import { Content} from "../components/content"

import styled from "styled-components"
import styles from "../css/styles"

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`

const CardImage = styled.img`
  display: block;
  width: 100%;
  position: relative;
  transition: transform 0.2s ease;
`

const CardHeader = styled.h3`
  font-family: "Karla";
  font-weight: 400;
  text-transform: uppercase;
  line-height: 2;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  position: absolute;
  bottom: 1rem;
  left: -1rem;
`

const Card = styled.div`
  animation: 1s ease forwards scaleIn;
  margin-bottom: 1rem;
  opacity: 0;
  padding: 1rem;
  position: relative;
  transition: background-color 0.2s ease;
  width: 33%;
  p {
    color: ${styles.white.normal};
  }
  h3 {
    background-color: ${styles.primary.normal};
    color: ${styles.white.normal};
  }
  @media only screen and (max-width: 900px) {
    width: 50%;
  }
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
  &:active {
    box-shadow: 0 2px 6px 0 ${styles.shadow};
  }
  &:hover {
    background: ${styles.white.normal};
    img {
      transform: scale(0.98);
    }
    p {
      color: ${styles.grey.text};
    }
  }
  &:nth-child(2) {
    animation-delay: 0.1s;
    h3 {
      background-color: ${styles.green};
    }
  }
  &:nth-child(3) {
    animation-delay: 0.2s;
    h3 {
      background-color: ${styles.purple};
    }
  }
  &:nth-child(4) {
    animation-delay: 0.3s;
    h3 {
      background-color: ${styles.blue};
    }
  }
  &:nth-child(5) {
    animation-delay: 0.4s;
    h3 {
      background-color: ${styles.orange};
    }
  }
  &:nth-child(6) {
    animation-delay: 0.5s;
    h3 {
      background-color: ${styles.primary.dark};
    }
  }
  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

function CardMenu(props) {
  return (
    <CardContainer>
      {props.categories.map(({node: category}) => (
        <Card key={category.name}>
          <Link key={category.name} to={`/${category.name.toLowerCase()}`}>
            <div style={{position:'relative'}}>
              <CardImage src="https://dummyimage.com/365x205/e3dada/999" alt="Dummy" />
              <CardHeader>{category.name}</CardHeader>
            </div>
            <Content style={{paddingTop: "1rem"}}>
              <p>{category.description}</p>
            </Content>
          </Link>
        </Card>
      ))}
    </CardContainer>
  )
}


export default CardMenu
