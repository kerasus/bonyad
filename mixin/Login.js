const mixinLogin = {
  methods: {
    initLogoutState() {
      // waiting for load window.imageObserver
      setTimeout(function(){
        AjaxLogin.showLogin(GlobalJsVar.loginActionUrl(), function (response) {
          window.location.reload();
        }, true);
      }, 1000);
    },
    isUserLogin() {
      return (GlobalJsVar.userId());
    },
  },
  created: function () {
    if (!this.isUserLogin()) {
      this.initLogoutState();
    }
  }
}

export default mixinLogin
