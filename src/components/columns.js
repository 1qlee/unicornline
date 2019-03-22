import styled from "styled-components"

const Columns = styled.div`
  display: flex;
  width: calc(100% - 80px);
  position: relative;
  left: 80px;
  @media only screen and (max-width: 860px) {
    flex-direction: column;
  }
`

const Column = styled.div`
  padding: 1rem;
  width: 50%;
  &.has-items-centered {
    display: flex;
    align-items: center;
  }
  @media only screen and (max-width: 860px) {
    width: 100%;
  }
`

export {Columns, Column}
