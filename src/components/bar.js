import styled from "styled-components"
import styles from "../css/styles.js"

const Bar = styled.div`
  animation: borderMe 0.6s ease-out forwards;
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 100%;
  z-index: 4;
  @keyframes borderMe {
    0% {
      background: ${styles.grey.light};
      box-shadow: none;
    }
    100% {
      background: ${styles.primary.normal};
      box-shadow: 0 1px 20px ${styles.primary.dark};
    }
  }
`

export default Bar
