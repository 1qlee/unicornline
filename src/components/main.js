import styled from "styled-components"
import styles from "../css/styles"

const Main = styled.div`
  background: ${styles.primary};
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  &.is-flex-center {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`

export default Main
