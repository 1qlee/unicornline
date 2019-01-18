import React from "react"
import throttle from "lodash/throttle"
import {graphql, StaticQuery} from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"

import UnicornLogo from "./unicorn.jpg"

const Nav = styled.nav`
  display: block;
  position: relative;
`

const NavContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  position: relative;
`

const NavItem = styled.div`
  padding: 1rem;
  &.is-active {
    a {
      color: ${styles.text};
    }
  }
`

const NavLogo = styled.a`
  display: block;
  img {
    display: block;
    height: 45px;
    min-width: 45px;
    width: 45px;
    padding: 5px;
    background: #fff;
    border-radius: 100%;
    box-shadow: 0 8px 30px 0 ${styles.shadow};
  }
`

const NavLeft = styled.div`
  margin-right: 1rem;
`

const NavRight = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const NavLink = styled.a`
  color: ${styles.grey.text};
  font-size: 0.875rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  &:hover {
    cursor: pointer;
    color: ${styles.text};
  }
`

const NavMenu = styled.div`
  background: ${styles.white};
  border-bottom: 3px solid ${styles.shadow};
  border-radius: 0.3rem;
  box-shadow: 0 1px 20px 0 ${styles.shadow};
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  position: absolute;
  right: 0;
  top: 65px;
  width: 250px;
  z-index: 99;
  &.menu-col-2 {
    width: 425px;
    a {
      width: 50%;
    }
  }
  &.menu-col-1 {
    width: 155px;
  }
  a {
    border-radius: 3px;
    color: ${styles.text};
    padding: 0.5rem 0.3rem;
    transition: color 0.1s ease, background-color 0.1s ease;
    width: 100%;
    &:hover {
      color: ${styles.white};
      background-color: ${styles.primary.normal};
    }
  }
`

const NavMenuArrow = styled.div`
  background: ${styles.white};
  box-shadow: -1px -1px 1px 0 ${styles.shadow};
  height: 16px;
  left: 50%;
  position: absolute;
  top: -8px;
  transform: translateX(-50%) rotate(45deg);
  width: 16px;
  &.is-right {
    right: 1rem;
    left: auto;
  }
`

const Hamburger = styled.div`
  padding: 1rem;
  position: relative;
  &.is-active {
    span {
      &:first-child {
        transform: rotate(45deg);
        top: 17px;
      }
      &:nth-child(2) {
        display: none;
      }
      &:nth-child(3) {
        transform: rotate(-45deg);
        top: 17px;
      }
    }
  }
  &:hover {
    span {
      background: ${styles.grey.dark};
    }
  }
  span {
    background: ${styles.grey.normal};
    height: 1px;
    left: 4px;
    position: absolute;
    transition: transform 0.2s ease;
    width: 24px;
    &:first-child {
      top: 10px;
    }
    &:nth-child(2) {
      top: 17px;
    }
    &:nth-child(3) {
      top: 24px;
    }
  }
`

const HamburgerDropdown = styled.div`
  background: ${styles.white};
  border-bottom: 3px solid ${styles.shadow};
  border-radius: 0.3rem;
  box-shadow: 0 1px 20px 0 ${styles.shadow};
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  z-index: 99;
`

// Nav hamburger menu component
class HamburgerMenu extends React.Component {
  state = {
    isActive: false
  }

  handleClick = (e) => {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  render() {
    return (
      <Hamburger className={this.state.isActive ? "is-active" : null} onClick={this.handleClick}>
        <span></span>
        <span></span>
        <span></span>
        {this.state.isActive ? (
          <HamburgerDropdown>
            {this.props.categories.edges.map(({node}) => (
              <NavItem key={node.id} id={node.name} className="nav-item">
                <NavLink href={`/${node.name.toLowerCase()}`}>{node.name}</NavLink>
              </NavItem>
            ))}
          </HamburgerDropdown>
        ) : (
          null
        )}
      </Hamburger>
    )
  }
}

// Nav dropdown menu component
class NavMenuContainer extends React.Component {
  // Pass all categories (graphql nodes) into component as props
  // Then render every product for each category
  render() {
    switch(this.props.category) {
      case "Accessory":
        return (
          <NavMenu className="menu-col-2" style={{right:"17rem"}}>
            <NavMenuArrow />
            {this.props.accessory.edges.map(({node}) => (
              <a key={node.id} href={"/accessory/" + node.slug}>{node.name}</a>
            ))}
          </NavMenu>
        )
      case "Presentation":
        return (
          <NavMenu className="menu-col-2" style={{right:"9rem"}}>
            <NavMenuArrow />
            {this.props.presentation.edges.map(({node}) => (
              <a key={node.id} href={"/presentation/" + node.slug}>{node.name}</a>
            ))}
          </NavMenu>
        )
      case "Display":
        return (
          <NavMenu className="menu-col-2" style={{right: "2rem"}}>
            <NavMenuArrow />
            {this.props.display.edges.map(({node}) => (
              <a key={node.id} href={"/display/" + node.slug}>{node.name}</a>
            ))}
          </NavMenu>
        )
      case "Creative":
        return (
          <NavMenu style={{right: "1.5rem"}}>
            <NavMenuArrow />
            {this.props.creative.edges.map(({node}) => (
              <a key={node.id} href={"/creative/" + node.slug}>{node.name}</a>
            ))}
          </NavMenu>
        )
      case "Award":
        return (
          <NavMenu className="menu-col-1" style={{right: "1.5rem"}}>
            <NavMenuArrow className="is-right" />
            {this.props.award.edges.map(({node}) => (
              <a key={node.id} href={"/award/" + node.slug}>{node.name}</a>
            ))}
          </NavMenu>
        )
      default:
        return null
    }
  }
}

// Navbar container component
class NavBar extends React.Component {
  constructor() {
    super()
    // showMenu hides or shows dropdown menu
    // currentCategory keeps track of which dropdown category was last shown
    this.state = {
      showMenu: false,
      currentCategory: null,
      showHamburger: window.innerWidth < 650
    }
    // Bind methods
    this.handlePointerEnter = this.handlePointerEnter.bind(this)
    this.handlePointerLeave = this.handlePointerLeave.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
  }

  // Handle small viewport width to toggle hamburger menu
  handleWindowResize = throttle(() => {
    this.onResize()
  }, 200)

  onResize = () => {
    this.setState({ showHamburger: window.innerWidth < 650 })
  }

  // Handle mouse entering a category link
  handlePointerEnter = (event) => {
    // Set state to show menu
    // Change currentCategory to the category that was hovered on
    this.setState({
      showMenu: true,
      currentCategory: event.target.textContent,
    })

    // Remove any pre-existing highlights on all category links
    const navItems = document.getElementsByClassName("nav-item")
    for (let item of navItems) {
      item.classList.remove("is-active")
    }
    // Highlight the text of the currently hovered category
    event.target.classList.add("is-active")
  }

  // Handle mouse leaving a category link
  handlePointerLeave = (event) => {
    // Remove any highlighting from category links
    const navItems = document.querySelector(".nav-item.is-active")
    if (navItems) {
      navItems.classList.remove("is-active")
    }

    // Set state to hide menu
    this.setState({
      showMenu: false,
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
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
          {this.state.showHamburger ? (
            <NavRight>
              <HamburgerMenu categories={this.props.categories} />
            </NavRight>
          ) : (
            <NavRight onPointerLeave={this.handlePointerLeave}>
              {this.props.categories.edges.map(({node}) => (
                <NavItem key={node.id} id={node.name} onPointerEnter={this.handlePointerEnter} className="nav-item">
                  <NavLink href={`/${node.name.toLowerCase()}`}>{node.name}</NavLink>
                </NavItem>
              ))}
              {this.state.showMenu ? (
                <NavMenuContainer
                  category={this.state.currentCategory}
                  accessory={this.props.accessory}
                  presentation={this.props.presentation}
                  display={this.props.display}
                  creative={this.props.creative}
                  award={this.props.award}
                />
              ) : (
                null
              )}
            </NavRight>
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
        allAccessory:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Accessory"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allPresentation:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Presentation"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allDisplay:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Display"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allCreative:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Creative"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allAward:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Award"}}) {
          edges {
            node {
              id
              name
              slug
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
      <NavBar categories={data.allDatoCmsCategory} accessory={data.allAccessory} presentation={data.allPresentation} display={data.allDisplay} creative={data.allCreative} award={data.allAward} />
    )}
  />
)
