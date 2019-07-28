import styled from "styled-components"
import styles from "../css/styles"

const ButtonTray = styled.div`
  display: flex;
  padding: 1rem;
`

const Button = styled.button`
  background: transparent;
  border: 1px solid ${styles.white.normal};
  color: ${styles.white.normal};
  padding: 0.5rem;
  position: relative;
  font-family: "Karla";
  font-size: 0.875rem;
  &::before {
    background: ${styles.white.normal};
    content: "";
    height: 0;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    transition: height 0.1s ease;
  }
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &:hover {
    cursor: pointer;
    border-color: ${styles.grey.hover};
    color: ${styles.grey.text};
    &::before {
      height: 100%;
    }
    &::after {
      content: "Download";
    }
  }
  &:not(:last-child) {
    border-right-width: 0;
  }
`

export { ButtonTray, Button }
