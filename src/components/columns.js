import styled from "styled-components"

const Columns = styled.div`
  display: flex;
  position: relative;
  transition: width 0.4s ease, transform 0.4s ease;
  width: 100%;
  will-change: transform;
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
  &.index-col-1 {
    padding: 5rem 0rem 5rem 1rem;
    @media only screen and (max-width: 1180px) {
      padding: 2rem 1rem 1rem;
    }
  }
  &.index-col-2 {
    padding: 5rem 0 5rem 1rem;
    @media only screen and (max-width: 1180px) {
      padding: 1rem 0 2rem;
    }
  }
  @media only screen and (max-width: 860px) {
    &.index-col-1,
    &.index-col-2 {
      width: 100%;
    }
  }
`

export {Columns, Column}
