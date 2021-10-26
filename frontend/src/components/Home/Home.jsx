import React from 'react';
import styles from './Home.module.css';
import image from '../../assets/image.svg';
import {useGlobalContext} from '../../context'
import { SignIn } from '../../components'

const Home = () => {
    const { user } = useGlobalContext()
    return (
        <div className={styles.homeWrapper}>
            <div className={styles.homeText}>
                <h1>The portfolio tracker <br></br>for <span>smart</span> investors.</h1>
                <p>Build conviction in the stocks in your portfolio and watchlist by documenting your thesis</p>
                <div>
                    <a href={!user ? "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fthethesisapi.herokuapp.com%2Fauth%2Fgoogle&client_id=228521055914-iok2bn1cbt1r0qr0jcbolnk71tij8m0l.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email" : undefined}>
                        <SignIn text="Sign In"/>
                    </a>
                </div>
            </div>
            <div className={styles.homeImage}>
                <img src={image} alt='svg'/>
            </div>
        </div>
    )
}

export default Home
