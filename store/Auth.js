// initial state
import {User} from '@/models/User'

export const state = () => ({
  user: null,
  redirectTo: null,
  accessToken: null
})

// getters
export const getters = {
  user(state) {
    return new User(state.user)
  },
  accessToken(state) {
    return state.accessToken
  },
  redirectTo(state) {
    return state.redirectTo
  },
  isLoggedIn(state) {
    return !!state.accessToken
  }
}

// mutations
export const mutations = {
  updateUser(state, newInfo) {
    state.user = newInfo
  },
  updateUserFirstName(state, newInfo) {
    state.user.first_name = newInfo
  },
  updateUserLastName(state, newInfo) {
    state.user.last_name = newInfo
  },
  updateAccessToken(state, newInfo) {
    state.accessToken = newInfo
  },
  updateRedirectTo(state, newInfo) {
    state.redirectTo = newInfo
  }
}

export const actions = {
  logout({commit}) {
    commit('updateUser', null)
    commit('updateAccessToken', null)
    commit('updateRedirectTo', null)
  }
}
