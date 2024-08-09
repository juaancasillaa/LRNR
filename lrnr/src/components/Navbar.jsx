import React, { useState } from "react"
import "./Navbar.css"
import { Link } from "react-router-dom"
import { FaBars } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import Logo from "./image-removebg-preview.png"

const Navbar = () => {
  const [Mobile, setMobile] = useState(false)
  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='Quiz'><img src={Logo} alt=""  className="logo" /></Link>
        <ul className={Mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
          <Link to='/' className='Quiz'><li>Quiz</li></Link>
          <Link to='/Account' className='Account'><li>Account</li></Link>
        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!Mobile)}>{Mobile ? <ImCross /> : <FaBars />}</button>
      </nav>
    </>
  )
}
export default Navbar