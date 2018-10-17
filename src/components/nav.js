import React from "react"
import styled from "styled-components"
import Container from "./container"

import UnicornLogo from "../../public/static/logo/unicorn.jpg"

const Nav = styled.nav`
  padding: 1rem 0;
`

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NavItem = styled.div`
  padding: 1rem;
`

const NavLeft = styled.div`
  padding-left: 8px;
`

const NavRight = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  p {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.875rem;
  }
  &:hover {
    cursor: pointer;
    color: #000;
  }
`

class NavBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Nav>
        <Container>
          <NavContainer>
            <NavLeft>
              <img height="45" width="45" src={UnicornLogo} alt="Logo" />
            </NavLeft>
            <NavRight>
              <NavItem>
                <p>Accessory</p>
              </NavItem>
              <NavItem>
                <p>Presentation</p>
              </NavItem>
              <NavItem>
                <p>Display</p>
              </NavItem>
              <NavItem>
                <p>Creative</p>
              </NavItem>
              <NavItem>
                <p>Award</p>
              </NavItem>
            </NavRight>
          </NavContainer>
        </Container>
      </Nav>
    )
  }
}

export default NavBar
