<template>
    <!-- App.vue -->
    <v-app>
        <v-navigation-drawer
            class="side-menu"
            app
            right
            permanent
            disable-resize-watcher
            :width="drawerSize"
        >
            <side-menu/>
        </v-navigation-drawer>
        <app-bar
            :width="windowSize"
        />
        <!-- Sizes your content based upon application components -->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
                <expansion-menu v-if=" windowSize.x <= 768"/>
                <!-- If using vue-router -->
                test
                <Nuxt />

                <auth />
            </v-container>
        </v-main>

        <v-footer
            v-if="false"
            app
        >
            <!-- -->
        </v-footer>

        <modal v-if="showUserInfoFormModalStatus" modal-max-width="700px">
            <div slot="header">
                تکمیل اطلاعات
            </div>
            <div slot="body">
                <user-info-form
                    :required-items="['first_name', 'last_name', 'province', 'city', 'gender', 'major', 'grade']"
                    :exceptions="['school']"
                    @userInfoUpdated="userInfoUpdated"
                />
            </div>
        </modal>
    </v-app>
</template>

<script>
import Auth from '@/utils/Auth'
import Modal from "@/components/abrisham/Modal";
import {User} from "@/models/User";
import UserInfoForm from "@/utils/UserInfoForm";
import AppBar from '@/components/abrisham/AppBar';
import SideMenu from '@/components/abrisham/SideMenu';
import ExpansionMenu from '@/components/abrisham/ExpansionMenu';

export default {
    components: {SideMenu, AppBar, ExpansionMenu, Auth, Modal, UserInfoForm},
    data() {
        return {
            drawer: true,
            showUserInfoFormModalStatus: false,
        }
    },
    props:['filterBoxCategory' ,'userAssetsCollection'],
    watch: {
        // 'windowSize.x' : function (newValue) {
        //   this.drawer = newValue > 576;
        // }
    },
    computed: {
        isLoggedIn() {
          return this.$store.getters["Auth/isLoggedIn"]
        },
        windowSize() {
            return { x: window.innerWidth, y: window.innerHeight }
        },
        drawerSize() {
            if (this.windowSize.x >= 1920) {
                return 130
            } else if (this.windowSize.x >= 1200) {
                return 100
            }  else if (this.windowSize.x >= 990) {
                return 80
            }  else if (this.windowSize.x >= 768) {
                return 60
            } else if (this.windowSize.x >= 576) {
                return 0
            }
            return 0
        },
        user() {
            return this.$store.getters.appProps.user;
        },
        userData(){
            return new User(this.$store.getters["Auth/user"])
        }
    },
    created() {
        this.$router.push({ path: '/abrisham/UserAbrishamProgress' })
        this.setToken();
        this.setUser()
        this.updatingAppProps()
        this.initUserInfoIfLoggedIn()
    },
    methods: {
        setToken() {
            // this.$axios.defaults.headers.common['Accept'] = 'application/json '
            // axios.defaults.headers.common['X-CSRF-TOKEN'] = window.Laravel.csrfToken
        },
        setUser(){
            // this.$store.commit('Auth/updateUser' , window.user)
        },
        updatingAppProps(){
            // this.$store.commit('Auth/updateUser', {
            //     user: this.userData,
            // });
        },
        userInfoUpdated() {
            this.initUserInfo()
        },

        initUserInfoIfLoggedIn(){
            if (!this.isLoggedIn) {
                this.initUserInfo();
            }
        },
        isUserInfoCompleted() {
            let status = true;

            if (!this.isValidString(this.user.first_name)) {
                status = false;
            }
            if (!this.isValidString(this.user.last_name)) {
                status = false;
            }
            if (!this.isValidString(this.user.shahr_id)) {
                status = false;
            }
            if (!this.user.gender || !this.isValidString(this.user.gender.id)) {
                status = false;
            }
            if (!this.user.major || !this.isValidString(this.user.major.id)) {
                status = false;
            }
            if (!this.user.grade || !this.isValidString(this.user.grade.id)) {
                status = false;
            }
            return status;
        },
        isValidString(string) {
            return (typeof string !== 'undefined' && string !== null && string.toString().trim().length > 0);
        },
        initUserInfo() {
            this.showUserInfoFormModalStatus = !this.isUserInfoCompleted();
        },
    }
}
</script>

<style lang="scss">
::-webkit-scrollbar-track{
    border-radius: 6px ;
    background-color: #F5F5F5 ;
}
::-webkit-scrollbar{
    width: 6px ;
    border-radius: 6px ;
    background-color: #F5F5F5 ;
}
::-webkit-scrollbar-thumb{
    border-radius: 6px ;
    background-color: #f7941d ;
}
@media screen and (max-width: 1200px) {

}

@media screen and (max-width: 768px) {
    .container {
        padding: 15px;
    }
}

@media screen and (max-width: 350px) {

}

@media screen and (max-width: 320px) {

}
</style>

<style>
.v-navigation-drawer.side-menu {
    min-height: 100%;
}
.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid #dee2e6;
    font-family: IRANSans;
    font-weight: 300;
    font-size: 1.2rem;
}
.modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem;
    font-family: IRANSans;
    font-weight: 300;
    font-size: 1.2rem;
}
.form-group {
    margin-bottom: 1rem;
}
.m-input-icon {
    position: relative;
    padding: 0;
    width: 100%;
}
.m-input-icon.m-input-icon--left .form-control {
    padding-right: 2.8rem;
}
.form-control.m-input--air {
    box-shadow: 0px 3px 20px 0px rgba(51, 51, 51, 0.11);
}
.form-control {
    font-family: IRANSans;
    font-size: 11px;
    border-radius: 0;
    display: block;
    width: 100%;
    height: calc(1.25em + 1.7rem + 2px);
    padding: 0.85rem 1.15rem;
    padding-right: 1.15rem;
    font-weight: 400;
    line-height: 1.25;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    border: 1px solid #e8ecf0;
}
button, input {
    overflow: visible;
}
.m-input-icon > .m-input-icon__icon {
    position: absolute;
    height: 100%;
    display: inline-block;
    text-align: center;
    top: 0;
    width: 3.2rem;
}
.btn-primary:hover {
    color: #fff !important;
    background-color: #384ad7 !important;
    border-color: #2e40d4 !important;
}
.btn {
    font-family: "IRANSans";
    box-shadow: none !important;
    cursor: pointer;
    border-radius: 0;
}
.btn-primary {
    color: #fff !important;
    background-color: #5867dd !important;
    border-color: #5867dd !important;
}
.btn.btn-primary.a--full-width.btnSubmitEvent {
    width: 100%;
}
.btn {
    display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    padding: 0.85rem 1.15rem;
    font-size: 1rem;
    line-height: 1.25;
    border-radius: 0;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.alert-danger:not(.m-alert--outline) {
    font-weight: bold;
    color: white;
    background-color: #f66e84;
    border-color: #f55f78;
}
.alert-danger {
    color: #7f2a38;
    background-color: #fddce2;
    border-color: #fcced6;
}
.alert-dismissible {
    padding-left: 4rem;
}
.alert {
    position: relative;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
}
.fade {
    -webkit-transition: opacity 0.15s linear;
}
.close:not(:disabled):not(.disabled):hover, .close:not(:disabled):not(.disabled):focus {
    opacity: .75;
}
.alert-danger:not(.m-alert--outline) .close {
    color: white;
}
.alert .close {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
}
.alert .close {
    font-family: "LineAwesome";
    text-decoration: inherit;
    text-rendering: optimizeLegibility;
    text-transform: none;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
    font-size: 1.2rem;
    outline: none !important;
    text-shadow: none;
    padding-top: 0.95rem;
    padding-bottom: 0;
    cursor: pointer;
}
.alert-dismissible .close {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.75rem 1.25rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    color: inherit;
}
button:not(:disabled), [type="button"]:not(:disabled), [type="reset"]:not(:disabled), [type="submit"]:not(:disabled) {
    cursor: pointer;
}
button.close {
    padding: 0;
    background-color: transparent;
    border: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
.close {
    float: left;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: .5;
}
button, [type="button"], [type="reset"], [type="submit"] {
    -webkit-appearance: button;
}
button, select {
    text-transform: none;
}
button, input {
    overflow: visible;
}
button {
    border-radius: 0;
}
button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner {
    padding: 0;
    border-style: none;
}
.modal .modal-content .modal-header .close::before, .alert .close::before {
    font-family: "Font Awesome 5 Free";
    content: "\f00d";
}
/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
.fa,
.fas,
.far,
.fal,
.fad,
.fab {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
}
.fa-user:before {
    content: "\f007";
}
.fa-location-arrow:before {
    content: "\f124";
}
.fa-graduation-cap:before {
    content: "\f19d";
}

@font-face {
    font-family: "Font Awesome 5 Free";
    font-style: normal;
    font-weight: 900;
    font-display: block;
    src: url(/fonts/vendor/fontawesome-free-sass-2/webfa-solid-900.eot?d47e596a5490f16f21ee57e8daed315a);
    src: url(/fonts/vendor/fontawesome-free-sass-2/webfa-solid-900.eot?d47e596a5490f16f21ee57e8daed315a) format("embedded-opentype"), url(/fonts/vendor/fontawesome-free-sass-2/webfa-solid-900.woff2?af96b2744b250585e30cf62e91afe9d9) format("woff2"), url(/fonts/vendor/fontawesome-free-sass-2/webfa-solid-900.woff?5dde9eca6241e6b978fce826749d0627) format("woff"), url(/fonts/vendor/fontawesome-free-sass-2/webfa-solid-900.ttf?3c8fb6c49d1241de6e6aacef5302610a) format("truetype"), url(/fonts/vendor/fontawesome-free-sass-2/webfa-solid-900.svg?bfcbb6522309e075d05625b3b8de4c8f) format("svg");
}
.fa,
.fas {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-size: large;
    color: #9298b6;
    top: 10px;
    position: relative;
}

</style>
