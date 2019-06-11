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

const TableLegend = styled.div`
  background-color: transparent;
  color: ${styles.text};
  font-weight: 700;
  font-size: 0.7rem;
  display: flex;
  text-align: center;
  margin-bottom: 5px;
  position: relative;
  text-transform: uppercase;
  vertical-align: middle;
  span {
    background-color: ${styles.white.normal};
    padding: 0.1rem 0.3rem;
    margin-right: 5px;
    border-radius: 5px;
    &.digital-legend {
      background-color: ${styles.yellow};
      color: ${styles.text};
    }
    &.offset-legend {
      background-color: ${styles.lime};
      color: ${styles.text};
    }
    &.inkjet-legend {
      background-color: ${styles.ice};
      color: ${styles.text};
    }
  }
`

const TableHead = styled.thead`
  th {
    background-color: ${styles.grey.hover};
    border-bottom: 1px solid transparent;
    color: ${styles.text};
    padding: 0.5rem !important;
    vertical-align: middle;
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
  border-color: ${styles.grey.border};
  border-width: 1px 0;
  border-style: solid;
  vertical-align: middle;
  padding: 0.5rem !important;
`

export {Table, TableLegend, TableHead, TableData}
