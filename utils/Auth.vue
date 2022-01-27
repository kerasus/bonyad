<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-card-title>
                    <v-img src="https://nodes.alaatv.com/upload/footer-alaaLogo.png?w=30&h=40"
                           max-height="40"
                           max-width="30"
                    />
                    <span class="text-h5">ورود به آلاء</span>
                </v-card-title>
                <v-card-text>
                    <v-progress-linear
                        v-if="loading"
                        indeterminate
                        color="yellow darken-2"
                    ></v-progress-linear>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="mobile"
                                    dir="ltr"
                                    label="شماره همراه"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="password"
                                    dir="ltr"
                                    label="کد ملی"
                                    type="password"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>با کد ملی ایران نیازی به ثبت نام نیست.</small>
                    <v-alert
                        v-for="message in errorMessages"
                        :key="message"
                        dense
                        outlined
                        text
                        type="error"
                        dismissible
                    >
                        {{ message }}
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        block
                        dark
                        :loading="loading"
                        color="#ff8f00"
                        @click="login"
                    >
                        ورود
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    name: 'Auth',
    data: () => ({
        errorMessages: [],
        mobile: null,
        password: null,
        dialog: false,
        loading: false
    }),
    created() {
        this.dialog = !this.isLoggedIn()
    },
    methods: {
        login () {
            this.loading = true
            axios.post(this.getLoginActionUrl(), {mobile: this.mobile, password: this.password})
            .then( response => {
                window.document.location.reload()
            })
            .catch( error => {
                this.loading = false

                const messages = []
                for (let key in error.response.data.errors) {
                    error.response.data.errors[key].forEach( message => {
                        messages.push(message)
                    })
                }

                this.errorMessages = messages
            })

        },
        getLoginActionUrl () {
            return document.querySelector('input[name="js-var-loginActionUrl"]').value
        },
        isLoggedIn () {
            const userID = document.querySelector('input[name="js-var-userId"]').value

            return !!(userID && userID !== 0)
        },
        showLoginModal () {
            setTimeout(function(){
                AjaxLogin.showLogin(GlobalJsVar.loginActionUrl(), function (response) {
                    window.location.reload();
                }, true);
            }, 1000);
        },
    }
}
</script>

<style scoped>

</style>
