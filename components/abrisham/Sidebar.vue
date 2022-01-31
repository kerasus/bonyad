<template>
    <transition name="Sidebar">
        <div class="Sidebar" :class="[ (position==='right') ? 'Sidebar-right' : '', (show) ? '' : 'hide']" :style="{'width': (minimized) ? '50px' : width, 'background': background}">
            <button class="btn btn-warning btn-block" @click="close">
                <i class="fa" :class="[ (position==='right') ? 'fa-angle-double-right' : 'fa-angle-double-left']"></i>
            </button>

            <button v-if="minimize" class="btn btn-info btn-minimize" @click="onMinimized">
                <i class="fa" :class="[ (!minimized) ? 'fa-minus' : 'fa-plus']"></i>
            </button>

            <div class="sicbarContent">
                <slot>

                </slot>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Sidebar",
        props: {
            position: {
                type: String,
                default: 'left'
            },
            width: {
                type: String,
                default: '320px'
            },
            background: {
                type: String,
                default: 'white'
            },
            minimize: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                show: false,
                minimized: false
            }
        },
        methods: {
            toggle() {
                if (this.getState()) {
                    this.close();
                } else {
                    this.open();
                }
            },
            open() {
                this.show = true;
                this.$emit('on-open', this.show);
            },
            close() {
                this.show = false;
                this.$emit('on-closed', this.show);
            },
            getState() {
                return this.show;
            },
            onToggle() {
                this.toggle();
                this.$emit('on-toggle', this.show);
            },
            onMinimized() {
                this.minimized = !this.minimized;
                this.$emit('on-minimized', this.minimized);
            }
        },
    }
</script>

<style scoped>
    .Sidebar {
        display: flex;
        flex-direction: column;
        position: fixed !important;
        top: 0;
        max-width: 100%;
        height: 100vh;
        max-width: 100% !important;
        height: 100vh !important;
        margin: 0 !important;
        outline: 0;
        transition: all .5s;
        z-index: 9999;
        -webkit-box-shadow: 0 0 17px -4px rgba(0,0,0,0.75);
        -moz-box-shadow: 0 0 17px -4px rgba(0,0,0,0.75);
        box-shadow: 0 0 17px -4px rgba(0,0,0,0.75);
    }
    .Sidebar .sicbarContent {
        overflow: auto;
    }
    .Sidebar:not(.Sidebar-right) {
        left: 0;
        right: auto;
    }
    .Sidebar.hide:not(.Sidebar-right) {
        /*opacity: 0;*/

        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;

        -webkit-transform:translateX(-100%);
        transform:translateX(-100%);
    }
    .Sidebar.hide.Sidebar-right {
        /*opacity: 0;*/
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        -webkit-transform:translateX(100%);
        transform:translateX(100%);
    }
    .Sidebar.Sidebar-right {
        left: auto;
        right: 0;
    }

    .Sidebar-enter-active,
    .Sidebar-leave-active {
        -webkit-transform: translateX(0);
        transform: translateX(0);
        /*opacity: 0;*/
    }
    .Sidebar-enter, .Sidebar-leave-to /* .fade-leave-active below version 2.1.8 */ {
        /*opacity: 1;*/
    }

    .Sidebar .btn-minimize {
        position: absolute;
        top: 0;
        right: 0;
    }

</style>
