import styled from "styled-components"
import styles from "../css/styles"

const Container = styled.div`
  background: ${styles.primary.normal};
  margin: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
`

export default Container
