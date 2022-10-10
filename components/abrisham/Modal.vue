<template>
    <div>
        <transition name="modal">
            <div class="modal-mask">
                <div class="modal-wrapper" @click="close($event)">
                    <div class="modal-container" ref="modalContainer"  @click="close($event)">

                        <div v-if="typeof $slots.header !== 'undefined'" class="modal-header" :class="{'no-padding': headerNoPadding}">
                            <slot name="header"></slot>
                        </div>

                        <div v-if="typeof $slots.body !== 'undefined'" class="modal-body" :class="{'no-padding': bodyNoPadding}">
                            <slot name="body"></slot>
                        </div>

                        <div v-if="typeof $slots.footer !== 'undefined'" class="modal-footer" :class="{'no-padding': footerNoPadding}">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "Modal",
    props: {
        headerNoPadding: {
            type: Boolean,
            default: false
        },
        bodyNoPadding: {
            type: Boolean,
            default: false
        },
        footerNoPadding: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            showModal: false
        }
    },
    watch: {

    },
    methods: {
        close(event) {
            if (typeof this.$refs.modalContainer === 'undefined' || !this.$refs.modalContainer.contains(event.target)) {
                this.$emit('close');
            }
        }
    },
    mounted: function () {

    }
}
</script>

<style scoped lang="scss">
.modal-mask {
    position: fixed;
    z-index: 9999999999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000080;
    overflow: auto;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal-wrapper {
    margin: auto;
    vertical-align: middle;
}
.modal-container {
    width: 700px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px #00000054;
    transition: all 0.3s ease;
    @media screen and (max-width: 768px){
        width: 600px;
    }
    @media screen and (max-width: 650px){
        width: 500px;
    }
    @media screen and (max-width: 576px){
        width: 450px;
    }
    @media screen and (max-width: 450px){
        width: 400px;
    }
    @media screen and (max-width: 350px){
        width: 320px;
    }
}

.modal-enter-active, .modal-leave-active {
    transition: opacity .5s;
}
.modal-enter, .modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

.no-padding {
    padding: 0;
}
</style>
