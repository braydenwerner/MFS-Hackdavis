import React, { useRef, useState, useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { signedInState, docDataState } from '../../atoms/atoms'
import { auth, db } from '../../firebase'
import './SignIn.scss'

export default function SignIn() {
  const signinRefEmail = useRef(null)
  const signinRefPassword = useRef(null)
  const signupRefEmail = useRef(null)
  const signupRefUsername = useRef(null)
  const signupRefPassword = useRef(null)
  const signupRefPasswordConfirm = useRef(null)

  const [signedIn, setSignedIn] = useRecoilState(signedInState)

  const setDocData = useSetRecoilState(docDataState)

  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    //  if user data saved in local storage, no need to log back in
    //  userData is the email of the user already logged in through local storage
    const userData = localStorage.user
    if (userData) {
      //  query database for values of user
      const docRef = db.collection('users').doc(userData)

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const tempDocData = {
              email: auth.currentUser.email,
              ...doc.data()
            }
            setDocData(tempDocData)
          }
        })
        .catch((error) => {
          handleError(error.message)
        })

      setSignedIn(true)
    }
  }, [])

  const signIn = (e) => {
    e.preventDefault()

    auth
      .signInWithEmailAndPassword(
        signinRefEmail.current.value,
        signinRefPassword.current.value
      )
      .then(() => {
        if (auth.currentUser.emailVerified) {
          //  console.log(`the email ${auth.currentUser.email} has been verified`)
          const docRef = db.collection('users').doc(auth.currentUser.email)

          docRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                const tempDocData = {
                  email: auth.currentUser.email,
                  ...doc.data()
                }
                setDocData(tempDocData)

                //  mark user as signed in on local data
                localStorage.setItem('user', auth.currentUser.email)
              }

              setSignedIn(true)
            })
            .catch((error) => {
              handleError(error.message)
            })
        } else {
          handleError(
            'You must verify your email before signing in! We are sending another verification email.'
          )
          sendVerificantionEmail()
        }
      })
      .catch((error) => {
        handleError(error.message)
      })
  }

  //  sign up, add defaul values to database
  const signUp = (e) => {
    e.preventDefault()
    if (
      signupRefPassword.current.value !== signupRefPasswordConfirm.current.value
    ) {
      handleError('Passwords do not match.')
      return
    }

    //  username cannot be only empty characters
    if (signupRefUsername.current.value.replace(/\s/g, '') === '') {
      handleError('Username cannot be empty.')
      return
    }

    const email = signupRefEmail.current.value
    const username = signupRefUsername.current.value
    const password = signupRefPassword.current.value

    //  check to make sure username not already in database
    db.collection('users')
      .where('username', '==', username)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size === 0) {
          console.log('r')
          auth
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              signupRefEmail.current.value = ''
              signupRefUsername.current.value = ''
              signupRefPassword.current.value = ''
              signupRefPasswordConfirm.current.value = ''

              db.collection('users')
                .doc(email)
                .set({
                  email: email,
                  username: username,
                  stocksOwned: [],
                  totalProfit: 0,
                  accountBalance: 5000
                })
                .catch((error) => {
                  console.log('failed creating a new doc')
                  handleError(error.message)
                })

              sendVerificantionEmail()
            })
            .catch((error) => {
              console.log('cannot create user')
              handleError(error.message)
            })
        } else {
          handleError('Username already exists')
        }
      })
      .catch((error) => {
        console.log('cannot open database')
        handleError(error.message)
      })
  }

  const sendVerificantionEmail = () => {
    auth.currentUser
      .sendEmailVerification()
      .then(() => {
        setMessage(
          'A confirmation email was sent. Confirm to activate your account!'
        )
      })
      .catch((error) => {
        handleError(error.code)
      })
  }

  const handleError = (error) => {
    if (message !== '') setMessage('')
    setErrorMessage(error)
    const unsetErrorInterval = setInterval(() => setErrorMessage(' '), 5000)
    setTimeout(() => clearInterval(unsetErrorInterval), 5000)
  }

  return (
    <>
      {!signedIn && (
        <div id="outer-signin-container">
          <div id="inner-signin-container">
            <form id="signin-form">
              <input
                type="text"
                placeholder="email"
                required
                ref={signinRefEmail}
                autoComplete="on"
              />
              <input
                type="password"
                placeholder="password"
                required
                ref={signinRefPassword}
                autoComplete="on"
              />
              <button onClick={signIn}>Login</button>
            </form>

            <form id="signup-form">
              <input
                type="text"
                placeholder="email"
                required
                ref={signupRefEmail}
                autoComplete="on"
              />
              <input
                type="text"
                placeholder="username"
                maxLength="20"
                required
                ref={signupRefUsername}
                autoComplete="on"
              />
              <input
                type="password"
                placeholder="password"
                required
                ref={signupRefPassword}
                autoComplete="on"
              />
              <input
                type="password"
                placeholder="confirm password"
                required
                ref={signupRefPasswordConfirm}
                autoComplete="on"
              />
              <button type="submit" onClick={signUp}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
      <div id="notification-container">
        {message !== '' && <div id="message">{message}</div>}

        {errorMessage !== '' && <div id="error-message">{errorMessage}</div>}
      </div>
    </>
  )
}
