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
  td {
    font-weight: 700;
    padding: 0.5rem;
    position: relative;
    text-transform: uppercase;
    vertical-align: middle;
    &::before {
      position: absolute;
      left: 0;
      top: 12px;
      content: '';
      border-radius: 100%;
      height: 5px;
      width: 5px;
    }
    &.digital-legend {
      color: ${styles.crimson};
      &::before {
        background: ${styles.crimson};
      }
    }
    &.offset-legend {
      color: ${styles.green};
      &::before {
        background: ${styles.green};
      }
    }
    &.inkjet-legend {
      color: ${styles.primary.light};
      &::before {
        background: ${styles.primary.light};
      }
    }
  }
  th {
    background-color: ${styles.grey.hover};
    border-bottom: 1px solid transparent;
    padding: 0.5rem !important;
    vertical-align: middle;
    &.digital {
      background-color: ${styles.crimson};
      color: ${styles.white.normal};
    }
    &.offset {
      background-color: ${styles.green};
      color: ${styles.white.normal};
    }
    &.inkjet {
      background-color: ${styles.primary.light};
      color: ${styles.white.normal};
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
