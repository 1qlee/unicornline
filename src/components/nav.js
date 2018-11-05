import React from "react"
import {graphql, StaticQuery} from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"

import UnicornLogo from "./unicorn.jpg"

const Nav = styled.nav`
  display: block;
`

const NavContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  position: relative;
`

const NavItem = styled.div`
  padding: 1rem;
`

const NavLogo = styled.a`
  display: block;
  img {
    display: block;
    height: 45px;
    width: 45px;
    padding: 5px;
    background: #fff;
    border-radius: 100%;
    box-shadow: 0 8px 30px 0 ${styles.shadow};
  }
`

const NavLeft = styled.div`
  padding-left: 8px;
`

const NavRight = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  a {
    font-size: 0.875rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    &:hover {
      cursor: pointer;
      color: #000;
    }
  }
`

const NavMenu = styled.div`
  background: ${styles.white};
  position: absolute;
  top: 100%;
  right: 0;
`

class NavBar extends React.Component {
  constructor(props) {
    super(props)
    // State
    this.state = {
      showMenu: false,
    }
    // Bind methods
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleMouseEnter() {
    // Set state to show menu
    console.log("Mouse detected")
    this.setState({
      showMenu: true,
    })
  }

  handleMouseLeave() {
    // Set state to hide menu
    console.log("Mouse left")
    this.setState({
      showMenu: false,
    })
  }

  render() {
    return (
      <Nav>
        <NavContainer>
          <NavLeft>
            <NavLogo href="/">
              <img src={UnicornLogo} alt="Logo" />
            </NavLogo>
          </NavLeft>
          <NavRight>

          </NavRight>
          { this.state.showMenu ? (
            <NavMenu>
              {this.props.children}
            </NavMenu>
          ) : (
            null
          )}
        </NavContainer>
      </Nav>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query NavQuery {
        allDatoCmsProduct(filter: {category: {eq: "Accessory"}}) {
          edges {
            node {
              id
              name
            }
          }
        }
        allDatoCmsCategory {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `}
    render={data => (
      <NavBar>
        {data.allDatoCmsProduct.edges.map(({node}) => (
          <NavItem key={node.id}>
            <a href={"/" + node.name}>{node.name}</a>
          </NavItem>
        ))}
      </NavBar>
    )}
  />
)
