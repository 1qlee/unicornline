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

const TableHead = styled.thead`
  th {
    padding: 0.5rem !important;
    border-bottom: 1px solid transparent;
    vertical-align: middle;
    &.digital {
      background-color: ${styles.crimson};
      color: ${styles.white};
    }
    &.offset {
      background-color: ${styles.green};
      color: ${styles.white};
    }
    &.inkjet {
      background-color: ${styles.primary.light};
      color: ${styles.white};
    }
    &.digital-legend {
      position: relative;
      color: ${styles.crimson};
      text-transform: uppercase;
      &::before {
        position: absolute;
        left: 0;
        top: 12px;
        content: '';
        background: ${styles.crimson};
        border-radius: 100%;
        height: 5px;
        width: 5px;
      }
    }
    &.offset-legend {
      position: relative;
      color: ${styles.green};
      text-transform: uppercase;
      &::before {
        position: absolute;
        left: 0;
        top: 12px;
        content: '';
        background: ${styles.green};
        border-radius: 100%;
        height: 5px;
        width: 5px;
      }
    }
    &.inkjet-legend {
      position: relative;
      color: ${styles.primary.light};
      text-transform: uppercase;
      &::before {
        position: absolute;
        left: 0;
        top: 12px;
        content: '';
        background: ${styles.primary.light};
        border-radius: 100%;
        height: 5px;
        width: 5px;
      }
    }
  }
`

const TableData = styled.td`
  border-color: ${styles.grey.text};
  border-width: 1px 0;
  border-style: solid;
  vertical-align: middle;
  padding: 0.5rem !important;
`

export {Table, TableHead, TableData}
