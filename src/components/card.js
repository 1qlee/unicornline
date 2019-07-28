import styled from "styled-components"
import styles from "../css/styles"

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const CardImage = styled.img`
  display: block;
  width: 325px;
`

const Card = styled.div`
  animation: 1s ease forwards scaleIn;
  background-color: ${styles.primary.normal};
  box-shadow: 0 2px 6px 0 ${styles.shadow};
  margin-bottom: 1rem;
  opacity: 0;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  width: 32%;
  h3 {
    color: ${styles.primary.normal};
    text-transform: uppercase;
    font-size: 0.875rem;
  }
  a {
    display: flex;
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &:active {
    box-shadow: 0 2px 6px 0 ${styles.shadow};
  }
  &:hover {
    box-shadow: 0 4px 20px 0 ${styles.shadow};
    transform: translateY(5px);
  }
  &:nth-child(2) {
    animation-delay: 0.1s;
    background-color: ${styles.green};
    h3 {
      color: ${styles.green};
    }
  }
  &:nth-child(3) {
    animation-delay: 0.2s;
    background-color: ${styles.purple};
    h3 {
      color: ${styles.purple};
    }
  }
  &:nth-child(4) {
    animation-delay: 0.3s;
    background-color: ${styles.blue};
    h3 {
      color: ${styles.blue};
    }
  }
  &:nth-child(5) {
    animation-delay: 0.4s;
    background-color: ${styles.orange};
    h3 {
      color: ${styles.orange};
    }
  }
  &:nth-child(6) {
    animation-delay: 0.5s;
    background-color: ${styles.primary.dark};
    h3 {
      color: ${styles.primary.dark};
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

export {CardContainer, Card, CardImage, CardButton, CardFooter}
