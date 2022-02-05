export default function redirectAdmin({store, redirect}) {
  let user = store.getters['Auth/user']
  console.log('user', user)
  if (user.permissions && !user.permissions.find(item => item === 'accessBonyadEhsanPanel')) {
    return redirect('/')
  }
}
