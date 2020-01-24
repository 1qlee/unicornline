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
  width: 33%;
  p {
    color: ${styles.grey.text};
  }
  h3 {
    background-color: ${styles.grey.dark};
    color: ${styles.white.normal};
  }
  @media only screen and (max-width: 900px) {
    width: 50%;
  }
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
  &:hover {
    img {
      transform: scale(0.98);
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
              <CardImage src={category.photo.url} alt={category.photo.alt} />
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
