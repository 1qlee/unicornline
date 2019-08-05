import styled from "styled-components"
import styles from "../css/styles"

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const CardImage = styled.img`
  display: block;
  width: 100%;
`

const CardContent = styled.div`
  padding: 1rem 2rem;
`

const Card = styled.div`
  animation: 1s ease forwards scaleIn;
  background-color: ${styles.white.normal};
  box-shadow: 0 2px 6px 0 ${styles.shadow};
  margin-bottom: 1rem;
  opacity: 0;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  width: calc(33% - 2rem);
  h3 {
    color: ${styles.primary.normal};
  }
  @media only screen and (max-width: 900px) {
    width: calc(50% - 2rem);
  }
  &:not(:last-child) {
    margin-right: 2rem;
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
    h3 {
      color: ${styles.green};
    }
  }
  &:nth-child(3) {
    animation-delay: 0.2s;
    h3 {
      color: ${styles.purple};
    }
  }
  &:nth-child(4) {
    animation-delay: 0.3s;
    h3 {
      color: ${styles.blue};
    }
  }
  &:nth-child(5) {
    animation-delay: 0.4s;
    h3 {
      color: ${styles.orange};
    }
  }
  &:nth-child(6) {
    animation-delay: 0.5s;
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

export {CardContainer, Card, CardImage, CardContent, CardButton, CardFooter}
