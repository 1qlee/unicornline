import styled from "styled-components"
import styles from "../css/styles"

const Table = styled.table`
  color: ${styles.white};
  overflow-x: auto;
  text-align: left;
  width: 100%;
`

const TableHead = styled.thead`
  th {
    padding: 0.5rem !important;
    border: 1px solid ${styles.white};
  }
`

const TableData = styled.td`
  border: 1px solid ${styles.white};
  padding: 0.5rem !important;
`

export {Table, TableHead, TableData}
