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

const CardFooter = styled.div`
  padding: 1rem;
`

const CardButton = styled.div`
  border: 2px solid ${props => props.background};
  color: ${props => props.background};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 1rem;
  position: relative;
  text-transform: uppercase;
  &:hover,
  &:focus {
    background: ${props => props.background};
    color: ${props => props.color};
    border-color: ${props => props.color};
    span {
      &:first-child {
        animation: 0.4s ease forwards buttonTextFadeOut;
      }
    }
    span {
      &:last-child {
        animation: 0.3s ease 0.3s forwards buttonArrowFadeIn;
      }
    }
  }
  span {
    &:last-child {
      opacity: 0;
      position: absolute;
      right: 1rem;
      top: 0.8rem;
      font-size: 1rem;
    }
  }
  @keyframes buttonTextFadeOut {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(200px);
    }
  }
  @keyframes buttonArrowFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

export {CardContainer, CardHeader, Card, CardImage, CardButton, CardFooter}
