import styled from "styled-components"
import styles from "../css/styles"

const Table = styled.table`
  color: ${styles.white.normal};
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
    background-color: ${styles.white.normal};
    padding: 0.2rem 0.5rem;
    font-weight: 400;
    &.digital-legend {
      background-color: ${styles.yellow};
    }
    &.offset-legend {
      background-color: ${styles.lime};
    }
    &.inkjet-legend {
      background-color: ${styles.ice};
    }
  }
`

const TableHead = styled.thead`
  th {
    background-color: ${styles.white.normal};
    color: ${styles.text};
    padding: 0.5rem !important;
    font-size: 0.75rem;
    vertical-align: middle;
    text-transform: uppercase;
    font-weight: 400;
    &.digital {
      background-color: ${styles.yellow};
      color: ${styles.text};
    }
    &.offset {
      background-color: ${styles.lime};
      color: ${styles.text};
    }
    &.inkjet {
      background-color: ${styles.ice};
      color: ${styles.text};
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
