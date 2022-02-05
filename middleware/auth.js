// https://nuxtjs.org/docs/directory-structure/middleware/#named-middleware
export default function auth({store, redirect}) {
  let token = store.getters['Auth/accessToken']
  if (!token) {
    return redirect('/login')
  }
}
