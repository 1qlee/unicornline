import styled from "styled-components"
import styles from "../css/styles.js"

const Bar = styled.div`
  animation: barFadeIn 0.6s ease-out forwards;
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 100%;
  transition: transform 1s ease, width 0.1s ease, height 0.1s ease;
  z-index: 4;
  @keyframes barFadeIn {
    0% {
      background: ${styles.grey.light};
      box-shadow: none;
    }
    100% {
      background: ${styles.primary.normal};
      box-shadow: 0 1px 20px ${styles.primary.dark};
    }
  }
  @keyframes barResize {
    25% {
      width: 5px;
    }
    75% {
      width: 5px;
      height: 5px;
      opacity: 0.4;
    }
    100% {
      height: 5px;
      width: 100%;
      background: ${styles.primary.normal};
    }
  }
  @media only screen and (max-width: 1180px) {
    animation: barResize 0.6s linear forwards;
  }
`

export default Bar
