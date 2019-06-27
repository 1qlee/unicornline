import styled from "styled-components"

const Columns = styled.div`
  display: flex;
  position: relative;
  transition: width 0.4s ease, transform 0.4s ease;
  width: 100%;
  will-change: transform;
`

const Column = styled.div`
  padding: 1rem;
  width: 50%;
  &.has-items-centered {
    display: flex;
    align-items: center;
  }
`

export {Columns, Column}
