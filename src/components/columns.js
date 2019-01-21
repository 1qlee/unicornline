import styled from "styled-components"
import styles from "../css/styles"

const Columns = styled.div`
  display: flex;
`

const Column = styled.div`
  padding: 1rem;
  width: ${props => props.width};
`

export {Columns, Column}
