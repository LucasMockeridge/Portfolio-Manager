import React, { useContext, useState } from 'react';
import useFetch from './api/index'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {

    const [loading, setLoading] = useState(true) 
    const [userData, setUserData] = useState(null)
    const [user, setUser] = useState(null)
    const formatNum = (num) => {
        let rounded = (Math.round(Number(num) * 100) / 100).toFixed(2)
        let splitRounded = rounded.split('.')
        let left = Number(splitRounded[0]).toLocaleString()
        return left + '.' + splitRounded[1] 
    }

    const getUser = async () => {
		const res = await fetch('https://thethesisapi.herokuapp.com/auth/me', {
            credentials: "include",
        })
        const data = await res.json();
        return data
    }

    useFetch(getUser, setUser, setUserData, setLoading)

    return (
        <AppContext.Provider value={{
            user,
            loading,
            setLoading,
            userData,
            setUserData,
            formatNum
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }
