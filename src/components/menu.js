import styled from "styled-components"
import styles from "../css/styles"

const Menu = styled.div`
  animation: scaleIn 0.4s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-wrap: wrap;
  margin: 1rem;
  &.accessory {
    .menu-item {
      background: ${styles.primary.normal};
    }
  }
  &.presentation {
    .menu-item {
      background: ${styles.green};
    }
  }
  &.display {
    .menu-item {
      background: ${styles.purple};
    }
  }
  &.creative {
    .menu-item {
      background: ${styles.blue};
    }
  }
  &.award {
    .menu-item {
      background: ${styles.orange};
    }
  }
  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const MenuItemWrapper = styled.div`
  margin-bottom: -1px;
  margin-right: -1px;
  width: 25%;
  @media only screen and (max-width: 620px) {
    width: 50%;
  }
`

const MenuItem = styled.div`
  align-items: center;
  border: 1px solid ${styles.shadow};
  display: flex;
  height: 100px;
  justify-content: center;
  padding: 1rem;
  position: relative;
  width: 100%;
  p {
    color: ${styles.white.normal};
  }
  &::before {
    background: ${styles.white.normal};
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: width 0.2s ease;
    width: 0;
  }
  &::after {
    color: ${styles.text};
    content: "View Item";
    left: 50%;
    opacity: 0;
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    transition: opacity 0.1s ease;
  }
  &:hover {
    cursor: pointer;
    &::before {
      width: 100%;
    }
    &::after {
      opacity: 1;
    }
  }
`

export {Menu, MenuItem, MenuItemWrapper}
