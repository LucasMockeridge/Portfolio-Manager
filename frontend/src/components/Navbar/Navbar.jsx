import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { Profile, SignIn, Logo, Hamburger, Searchbar } from '../../components';
import links from '../Navlinks/Navlinks.js';
import styles from './Navbar.module.css';
import { useGlobalContext } from '../../context'

const Navbar = () => {
    const [clicked, setClicked] = useState(false)
    const { pathname } = useLocation()
    const { user } = useGlobalContext()

    const signOut = async () => {
		const res = await fetch("https://thethesisapi.herokuapp.com/signout", {method: 'DELETE', credentials: "include"})
		const signedOut = await res.text()
		return signedOut
    }

    return (
        <nav className={clicked ? styles.border : undefined}>
            <Link onClick={() => setClicked(false)} to='/'>
                <Logo />
            </Link>
            <Hamburger clicked={clicked} setClicked={setClicked} />
            <ul className={clicked ? styles.active : undefined}>
                {links.map((link, index) => {
                    const { name, path } = link;
                    return (
                        <li key={index}>
                            <Link onClick={() => setClicked(false)} to={path} className={pathname === path ? styles.active : undefined}>{name}</Link>
                        </li>
                    )
                })}
                        <li>
                            <Searchbar />
                        </li>
                {user && 
                    <>
                        <li className={styles.profileList}>
                            <Profile img={user.picture} signOut={signOut}/>
                        </li>
                        <li onClick={signOut} className={styles.signOutList}>
                            <SignIn text="Sign Out" />
                        </li>
                    </>
                }
            </ul>
        </nav>
    )
}

export default Navbar
