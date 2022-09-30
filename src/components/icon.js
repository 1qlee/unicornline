import styled from "styled-components"

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.margin};
  height: ${props => props.height || "36px"};
  width: ${props => props.width || "36px"};
`

export default Icon
