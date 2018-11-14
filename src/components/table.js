import styled from "styled-components"
import styles from "../css/styles"

const Table = styled.table`
  color: ${styles.text};
  overflow-x: auto;
  text-align: left;
  width: 100%;
`

const TableHead = styled.thead`
  th {
    padding: 0.5rem !important;
    border: 1px solid ${styles.grey.text};
  }
`

const TableData = styled.td`
  border: 1px solid ${styles.grey.text};
  padding: 0.5rem !important;
`

export {Table, TableHead, TableData}
