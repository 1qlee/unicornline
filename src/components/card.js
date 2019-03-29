import styled from "styled-components"
import styles from "../css/styles"

const Card = styled.div`
  box-shadow: 0 2px 6px 0 ${styles.shadow};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 325px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &:hover {
    box-shadow: 0 4px 20px 0 ${styles.shadow};
  }
  &:active {
    box-shadow: 0 2px 6px 0 ${styles.shadow};
    transform: translateY(2px);
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
  transition: all 0.3s;
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

export {Card, CardButton, CardFooter}
