import React, { useState, useEffect } from 'react'
import Fade from 'react-reveal/Fade'
import { Link } from 'react-scroll'
import { useRecoilState, useRecoilValue } from 'recoil'
import { docDataState, signedInState } from '../../atoms/atoms'
import { auth } from '../../firebase'
import './Nav.scss'

export default function Nav() {
  const [isMounted, setMounted] = useState(false)
  const [signedIn, setSignedIn] = useRecoilState(signedInState)
  const docData = useRecoilValue(docDataState)

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 900)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    console.log(docData)
  }, [docData])

  const signOut = () => {
    auth.signOut().catch((error) => {
      console.log(error)
    })

    setSignedIn(false)
    localStorage.removeItem('user')
  }

  return (
    <>
      <div>
        {isMounted && (
          <Fade down>
            <div id="navContainer">
              {!signedIn && (
                <div className="nav-notSignedIn">
                  <div id="nav-signIn">Log In</div>
                  <div id="nav-signUp">Sign Up</div>
                </div>
              )}
              {signedIn && (
                <div className="nav-signedIn">
                  <div id="nav-signIn">Profile</div>
                  <div id="nav-signIn">Signed in as {docData.username}</div>
                  <div id="nav-signOut" onClick={signOut}>
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          </Fade>
        )}
      </div>
    </>
  )
}
