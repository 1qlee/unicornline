import React, { useState } from "react"
import styled from "styled-components"
import styles from "../css/styles"
import Download from "../../assets/download.svg"
import Icon from "../components/icon"

const ButtonTray = styled.div`
  display: flex;
  padding: 1rem;
`

const StyledButton = styled.a`
  background-color: ${styles.primary.normal};
  border: none;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  color: ${styles.white.normal};
  padding: 0.5rem;
  position: relative;
  font-family: "Alata";
  font-size: 0.875rem;
  transition: background-color 0.2s;
  &:hover {
    cursor: pointer;
    background-color: ${styles.primary.light};
  }
  &:not(:last-child) {
    margin-right: 8px;
  }
  svg {
    fill: #fff;
    polyline {
      fill: #fff;
      stroke: #fff;
    }
    line {
      fill: #fff;
      stroke: #fff;
    }
    path {
      stroke: #fff;
    }
  }
`

function Button({ children }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <StyledButton>
      <Icon
        width="16px"
        height="16px"
        margin="0 4px 0 0"
      >
        <Download width="16" height="16" />
      </Icon>
      <span>{children}</span>
    </StyledButton>
  )
}

export { ButtonTray, Button }
