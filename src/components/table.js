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
    padding: 0.2rem 0.5rem;
    &.digital-legend {
      color: ${styles.digital};
    }
    &.offset-legend {
      color: ${styles.offset};
    }
    &.inkjet-legend {
      color: ${styles.inkjet};
    }
  }
`

const Droplet = styled.span`
  color: transparent;
  text-shadow: 0 0 0 ${props => props.color};
`

const TableHead = styled.thead`
  th {
    padding: 0.5rem !important;
    font-size: 0.75rem;
    vertical-align: middle;
    text-align: center;
    text-transform: uppercase;
    &.digital {
      background-color: ${styles.digital};
      color: ${styles.white.normal};
    }
    &.offset {
      background-color: ${styles.offset};
      color: ${styles.white.normal};
    }
    &.inkjet {
      background-color: ${styles.inkjet};
      color: ${styles.white.normal};
    }
  }
`

const TableData = styled.td`
  padding: 0.5rem !important;
  vertical-align: middle;
`

export {Table, TableLegend, TableHead, TableData, Droplet}
