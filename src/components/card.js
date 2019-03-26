import styled from "styled-components"
import styles from "../css/styles"

const Card = styled.div`
  box-shadow: 0 2px 6px 0 ${styles.shadow};
  display: block;
  padding: 2rem;
  position: relative;
  min-width: 325px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &:hover {
    box-shadow: 0 4px 20px 0 ${styles.shadow};
    .card-button {
      animation: buttonFadeIn 0.6s ease forwards;
    }
  }
  &:active {
    box-shadow: 0 2px 6px 0 ${styles.shadow};
    transform: translateY(2px);
  }
`

const CardButton = styled.div`
  padding: 1rem;
  position: absolute;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8rem;
  font-weight: 700;
  bottom: 0;
  left: 0;
  visibility: hidden;
  transition: all 0.3s;
  border: 2px solid ${props => props.background};
  color: ${props => props.background};
  &:hover {
    background: ${props => props.background};
    color: ${props => props.color};
    border-color: ${props => props.color};
  }
  @keyframes buttonFadeIn {
    0% {
      opacity: 0;
      visibility: hidden;
      transform: translateX(-10px);
    }
    50% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(0px);
      opacity: 1;
      visibility: visible;
    }
  }
`

export {Card, CardButton}
