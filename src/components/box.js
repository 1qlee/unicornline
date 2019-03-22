import styled from "styled-components"
import styles from "../css/styles"

const Box = styled.div`
  animation: border 1s ease forwards;
  background: url(${props => props.photo}) no-repeat center;
  background-size: cover;
  display: block;
  padding: 2rem;
  position: relative;
  height: 600px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  z-index: 99;
  img {
    width: 300px;
    margin-bottom: 1rem;
  }
  &:last-child {
    grid-column: span 2;
  }
  &:hover {
    box-shadow: 0 4px 20px 0 ${styles.shadow};
    transform: translateY(-2px);
  }
  &:active {
    box-shadow: 0 2px 6px 0 ${styles.shadow};
    transform: translateY(2px);
  }
  @keyframes border {
    0% {
      border-width-top: 0;
      border-width-color: transparent;
    }
    100% {
      border-width-top: 1px;
      border-color-top: blue;
    }
  }
`

export default Box
