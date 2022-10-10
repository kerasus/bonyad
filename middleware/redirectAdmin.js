export default function redirectAdmin({store, redirect}) {
  let user = store.getters['Auth/user']
  if (user.permissions && !user.permissions.find(item => item === 'accessBonyadEhsanPanel')) {
    return redirect('/')
  }
}
