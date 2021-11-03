import React, {useState} from 'react';
import { useClickOutside } from '../Kebab/Kebab'
import styles from './Profile.module.css'
import { useGlobalContext } from '../../context'
import { deleteUser } from '../../api'

const Profile = ({img, signOut}) => {
    const [clicked, setClicked] = useState(false)
    const { user } = useGlobalContext()

    const deleteAccount = async () => {
        const body = {_id: user.id}
		await signOut()
        await deleteUser(body)
		window.location.href = "/"
    }

	const signOutHandler = async () => {
		await signOut()
		window.location.href = "/"
	}

    return (
        <div onClick={()=> setClicked(!clicked)} className={styles.profileWrapper} ref={useClickOutside(()=>setClicked(false))}>
            <img className={styles.profilePicture} src={img} alt="profile"/>
            {clicked && <div className={styles.profileMenu}>
               <div onClick={deleteAccount}>Delete Account</div> 
                <div onClick={signOutHandler}>Sign Out</div>
            </div>}
        </div>
    )
}

export default Profile;
