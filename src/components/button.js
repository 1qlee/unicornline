import styled from "styled-components"
import styles from "../css/styles"

const ButtonTray = styled.div`
  display: flex;
  padding: 1rem;
`

const Button = styled.a`
  background: ${styles.primary.normal};
  border: 1px solid ${styles.white.normal};
  color: ${styles.white.normal};
  padding: 0.5rem;
  position: relative;
  font-family: "Alata";
  font-size: 0.875rem;
  &::before {
    background: ${styles.grey.light};
    content: "";
    height: 0;
    left: 0;
    position: absolute;
    top: 0;
    width: 0;
    transition: height 0.2s, width 0.2s;
  }
  &::after {
    content: "Download";
    position: absolute;
    opacity: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s;
  }
  &:hover {
    cursor: pointer;
    border-color: ${styles.grey.hover};
    color: ${styles.text};
    &::before {
      height: 100%;
      width: 100%;
    }
    &::after {
      opacity: 1;
    }
  }
  &:not(:last-child) {
    border-right-width: 0;
  }
`

export { ButtonTray, Button }
