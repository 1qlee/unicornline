import styled from "styled-components"
import styles from "../css/styles"

const Grid = styled.div`
  background: ${styles.primary.normal};
  box-shadow: -9px 12px 20px #a0c5da;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
`

export default Grid
