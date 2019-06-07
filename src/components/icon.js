import styled from "styled-components"

const Icon = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.background};
  color: ${props => props.color};
  height: 36px;
  width: 36px;
`

export default Icon
