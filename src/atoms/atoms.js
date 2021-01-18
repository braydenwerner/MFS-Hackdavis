import { atom } from 'recoil'

export const signedInState = atom({
  key: 'signedInState',
  default: false
})

export const docDataState = atom({
  key: 'docDataState',
  default: {}
})
