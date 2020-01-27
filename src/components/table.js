import styled from "styled-components"
import styles from "../css/styles"

const Table = styled.table`
  color: ${styles.text};
  display: block;
  font-size: 0.75rem;
  overflow-x: auto;
  text-align: left;
  width: auto;
`

const TableLegend = styled.thead`
  background-color: transparent;
  color: ${styles.text};
  display: flex;
  font-size: 0.75rem;
  margin-bottom: 5px;
  position: relative;
  text-transform: uppercase;
  vertical-align: middle;
  th {
    background-color: ${styles.grey.normal};
    color: ${styles.white.normal};
    padding: 0.2rem 0.5rem;
    &.digital-legend {
      background-color: ${styles.primary.normal};
      color: ${styles.white.normal};
    }
    &.offset-legend {
      background-color: ${styles.green};
      color: ${styles.white.normal};
    }
    &.inkjet-legend {
      background-color: ${styles.blue};
      color: ${styles.white.normal};
    }
  }
`

const TableHead = styled.thead`
  th {
    padding: 0.5rem !important;
    font-size: 0.75rem;
    vertical-align: middle;
    text-align: center;
    text-transform: uppercase;
    &.digital {
      background-color: ${styles.primary.normal};
      color: ${styles.white.normal};
    }
    &.offset {
      background-color: ${styles.green};
      color: ${styles.white.normal};
    }
    &.inkjet {
      background-color: ${styles.blue};
      color: ${styles.white.normal};
    }
  }
`

const TableData = styled.td`
  border-color: ${styles.white.light};
  border-width: 1px 0;
  border-style: solid;
  vertical-align: middle;
  padding: 0.5rem !important;
`

export {Table, TableLegend, TableHead, TableData}
