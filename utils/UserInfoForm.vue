<template>
    <div>
        <loading :active.sync="loading"
                 :can-cancel="false"
                 is-full-page
        />
        <div class="row">
<!--            <alaa-input :field="{ title: 'تیتر', disabled: false, required: false, type: 'text' }" />-->
            <div class="col-md-4" v-if="!isException('first_name')">
                <div class="form-group m-form__group">
                    <label>
                        <span class="requiredItem" v-if="isRequired('first_name')">*</span>
                        نام
                    </label>
                    <div class="m-input-icon m-input-icon--left">
                        <input type="text" class="form-control m-input m-input--air" placeholder="نام" v-model="user.first_name" :disabled="firstNameDisabled">
                        <span class="m-input-icon__icon m-input-icon__icon--left">
                            <span>
                                <i class="fa fa-user"></i>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-4" v-if="!isException('last_name')">
                <div class="form-group m-form__group">
                    <label>
                        <span class="requiredItem" v-if="isRequired('last_name')">*</span>
                        نام خانوادگی
                    </label>
                    <div class="m-input-icon m-input-icon--left">
                        <input type="text" class="form-control m-input m-input--air" placeholder="نام خانوادگی" v-model="user.last_name" :disabled="lastNameDisabled">
                        <span class="m-input-icon__icon m-input-icon__icon--left">
                            <span>
                                <i class="fa fa-user"></i>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-4" v-if="!isException('gender')">
                <div class="form-group m-form__group ">
                    <label>
                        <span class="requiredItem" v-if="isRequired('gender')">*</span>
                        جنسیت
                    </label>
                    <div class="m-input-icon m-input-icon--left">
                        <select class="form-control m-input m-input--air" v-model="user.gender.id">
                            <option :value="null">نامشخص</option>
                            <option v-for="gender in userForm.genders"
                                    :key="gender.id"
                                    :value="gender.id"
                                    :selected="user.gender.id === gender.id"
                            >
                                {{ gender.title }}
                            </option>
                        </select>
                        <span class="m-input-icon__icon m-input-icon__icon--left">
                            <span>
                                <i class="fa fa-user"></i>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-6" v-if="!isException('province')">
                <div class="form-group m-form__group ">
                    <label>
                        <span class="requiredItem" v-if="isRequired('province')">*</span>
                        استان
                    </label>
                    <div class="m-input-icon m-input-icon--left">
                        <model-list-select :list="userForm.provinces" option-value="id" option-text="title" v-model="userProvinceId" placeholder="استان"/>                        <span class="m-input-icon__icon m-input-icon__icon--left">
                            <span>
                                <i class="fa fa-location-arrow"></i>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-6" v-if="!isException('city')">
                <div class="form-group m-form__group ">
                    <label>
                        <span class="requiredItem" v-if="isRequired('city')">*</span>
                        شهر
                    </label>
                    <div class="m-input-icon m-input-icon--left">
                        <model-list-select :list="cities" option-value="id" option-text="title" v-model="userShahrId" placeholder="شهر"/>
                        <span class="m-input-icon__icon m-input-icon__icon--left">
                            <span>
                                <i class="fa fa-location-arrow"></i>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-6" v-if="!isException('school')">
                <div class="form-group m-form__group ">
                    <label>
                        <span class="requiredItem" v-if="isRequired('school')">*</span>
                        مدرسه
                    </label>
                    <div class="m-input-icon m-input-icon--left">
                        <input type="text" class="form-control m-input m-input--air" placeholder="مدرسه" v-model="user.school">
                        <span class="m-input-icon__icon m-input-icon__icon--left">
                            <span>
                                <i class="fa fa-university"></i>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-6"  v-if="!isException('major')">
                <div class="form-group m-form__group ">
                    <label>
                        <span class="requiredItem" v-if="isRequired('major')">*</span>
                        رشته
                    </label>
                    <div class="m-input-icon m-input-icon--left">
                        <select class="form-control m-input m-input--air" v-model="user.major.id">
                            <option :value="null">نامشخص</option>
                            <option v-for="major in userForm.majors"
                                    :key="major.id"
                                    :value="major.id"
                                    :selected="user.major.id === major.id"
                            >
                                {{ major.title }}
                            </option>
                        </select>
                        <span class="m-input-icon__icon m-input-icon__icon--left">
                            <span>
                                <i class="fa fa-graduation-cap"></i>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-6"  v-if="!isException('grade')">
                <div class="form-group m-form__group ">
                    <label>
                        <span class="requiredItem" v-if="isRequired('grade')">*</span>
                        مقطع
                    </label>
                    <div class="m-input-icon m-input-icon--left">
                        <select class="form-control m-input m-input--air" v-model="user.grade.id">
                            <option :value="null">نامشخص</option>
                            <option value="5" :selected="user.grade.id === 5">هفتم</option>
                            <option value="6" :selected="user.grade.id === 6">هشتم</option>
                            <option value="7" :selected="user.grade.id === 7">نهم</option>
                            <option value="1" :selected="user.grade.id === 1">دهم</option>
                            <option value="2" :selected="user.grade.id === 2">یازدهم</option>
                            <option value="8" :selected="user.grade.id === 8">دوازدهم</option>
                            <option value="9" :selected="user.grade.id === 9">فارغ التحصیل نظام جدید</option>
                            <option value="10" :selected="user.grade.id === 10">فارغ التحصیل نظام قدیم</option>
                        </select>
                        <span class="m-input-icon__icon m-input-icon__icon--left">
                            <span>
                                <i class="fa fa-graduation-cap"></i>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div v-for="(item, index) in submitMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    </button>
                    <strong>{{ item }}</strong>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <button type="button" class="btn btn-primary a--full-width btnSubmitEvent" @click="editUserInfo">ذخیره</button>
            </div>
        </div>

    </div>
</template>

<script>
    import Assist from "@/utils/Assist";
    import {User} from "@/models/User";
    import 'vue-search-select/dist/VueSearchSelect.css'
    import { ModelListSelect } from 'vue-search-select'
    import Loading from 'vue-loading-overlay'
    import 'vue-loading-overlay/dist/vue-loading.css'
    import axios from 'axios'
    // import alaaInput from "./AlaaInput";

    export default {
        name: "UserInfoForm",
        props: {
            requiredItems: {
                type: Array,
                default: []
            },
            exceptions: {
                type: Array,
                default: []
            }
        },
        components: {
            // alaaInput,
            ModelListSelect,
            Loading
        },
        computed: {
            user() {
                return new User(this.$store.getters.appProps.user)
            },
            cities () {
                if (this.user.province) {
                    return this.userForm.cities.filter(city => city.province.id === this.userProvinceId)
                }
                return []
            }
        },
        created () {
            this.loading = true
            axios.get('/megaroute/getUserFormData', {
                headers: {
                    // 'Accept': 'application/json',
                    // 'X-CSRF-TOKEN': window.Laravel.csrfToken,
                }
            })
            .then((response) => {
                this.userForm = response.data.data
                this.resetUserData(this.user)
                this.loading = false
                // const userShahr = this.getCityById(this.user.shahr_id)
                // if (userShahr) {
                //     this.user.province = userShahr.province
                // } else {
                //     this.user.province = { id: null, title: null }
                // }
            })
        },
        mounted: function () {
            this.checkNamesDisablity()
        },
        watch: {
            userProvinceId () {
                this.user.province.id = this.userProvinceId
            },
            userShahrId () {
                this.user.shahr_id = this.userShahrId
            }
        },
        data() {
            return {
                userProvinceId: null,
                userShahrId: null,
                userInfoInForm: {},
                submitMessage: [],
                firstNameDisabled: false,
                lastNameDisabled: false,
                userForm: {
                    cities: [],
                    genders: [],
                    grades: [],
                    majors: [],
                    provinces: []
                },
                loading: true
            }
        },
        methods: {
            isException (name) {
                return this.exceptions.indexOf(name) !== -1
            },
            getCityById (id) {
                return this.userForm.cities.find(city => city.id === id)
            },
            isRequired(name) {
                return this.requiredItems.includes(name);
            },
            checkNamesDisablity () {
                if (this.user.isUserInfoCompleted(['first_name'])) {
                    this.firstNameDisabled = true
                }
                if (this.user.isUserInfoCompleted(['last_name'])) {
                    this.lastNameDisabled = true
                }
            },
            readUserData () {
                this.userShahrId = this.user.shahr.id
                this.userProvinceId = this.user.province.id
            },
            resetUserData (userData) {
                userData.major_id = userData.major.id
                userData.gender_id = userData.gender.id
                userData.grade_id = userData.grade.id

                const userShahr = this.getCityById(userData.shahr.id)
                if (userShahr) {
                    userData.province = userShahr.province
                } else {
                    userData.province = { id: null, title: null }
                }
                // userData.province.id = this.userProvinceId
                // userData.shahr.id = this.userShahrId
                userData.shahr = userShahr
                userData.shahr_id = this.userShahrId
                this.$store.commit('updateAppProps', function (appProps) {
                    appProps.user = userData
                });
                this.readUserData()
            },
            canSubmit() {
                let status = true;

                if (!this.isValidString(this.user.first_name) && this.isRequired('first_name') && !this.isException('first_name')) {
                    status = false;
                    this.submitMessage.push('نام خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.last_name) && this.isRequired('last_name') && !this.isException('last_name')) {
                    status = false;
                    this.submitMessage.push('نام خانوادگی خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.province) && this.isRequired('province') && !this.isException('province')) {
                    status = false;
                    this.submitMessage.push('استان خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.shahr_id) && this.isRequired('city') && !this.isException('city')) {
                    status = false;
                    this.submitMessage.push('شهر خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.school) && this.isRequired('school') && !this.isException('school')) {
                    status = false;
                    this.submitMessage.push('نام مدرسه خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.gender.id) && this.isRequired('gender') && !this.isException('gender')) {
                    status = false;
                    this.submitMessage.push('جنسیت خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.major.id) && this.isRequired('major') && !this.isException('major')) {
                    status = false;
                    this.submitMessage.push('رشته خود را مشخص کنید.');
                }
                if (!this.isValidString(this.user.grade.id) && this.isRequired('grade') && !this.isException('grade')) {
                    status = false;
                    this.submitMessage.push('مقطع خود را مشخص کنید.');
                }

                return status;
            },
            editUserInfo() {

                if (!this.canSubmit()) {
                    return;
                }

                mApp.block('.btnSubmitEvent', {
                    type: "loader",
                    state: "info",
                });

                let that = this;
                this.user.updateType = 'profile';
                delete this.user.photo;

                this.resetUserData(this.user)

                console.log('updated');
                // this.user['_mehod'] = 'PUT'
                axios.put('/api/v2/user/' + this.user.id, this.user, {
                    headers : {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': window.Laravel.csrfToken,
                    }
                })
                // this.user.update(undefined, {
                //     'Accept': 'application/json',
                //     'X-CSRF-TOKEN': window.Laravel.csrfToken,
                // })
                    .then(function (response) {
                        if (response.errors) {
                            // var message = data.error.message;
                            // toastr.warning('خطای سیستمی رخ داده است.' + '<br>' + message);
                        } else {
                            let userData = new User(response.data.data);
                            that.resetUserData(userData)
                            that.checkNamesDisablity()
                            mApp.unblock('.btnSubmitEvent')
                            that.$emit('userInfoUpdated');
                        }
                    })
                    .catch(function (error) {
                        mApp.unblock('.btnSubmitEvent');
                        toastr.error('مشکلی رخ داده است.');
                        Assist.handleErrorMessage(error);
                    });
            },
            isValidString(string) {
                return (typeof string !== 'undefined' && string !== null && string.toString().trim().length > 0);
            }
        }
    }
</script>

<style scoped>
    .requiredItem {
        color: red;
    }

    .ui.fluid.search.selection.dropdown {
        display: flex;
        padding-right: 40px;
        min-height: 36px;
    }

    .ui.selection.dropdown,
    .ui.selection.dropdown:hover {
        border-radius: 0;
        box-shadow: 0 3px 20px 0 rgb(51 51 51 / 11%);
        border-color: #ebedf2;
    }
</style>


