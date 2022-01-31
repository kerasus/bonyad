// https://nuxtjs.org/docs/directory-structure/middleware/#named-middleware
export default function auth({store, redirect}) {
  let token = store.getters['Auth/accessToken']
  console.log('token', token)
  console.log('redirect', redirect)
  if (!token) {
    return redirect('/login')
  }
}
