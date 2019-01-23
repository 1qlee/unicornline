import styled from "styled-components"

const Columns = styled.div`
  display: flex;
  width: 100%;
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
