<template>
    <div class="SearchToolCheckBox pretty p-icon p-plain p-toggle">
        <input
            :disabled="disabled"
            :type="type"
            :name="name"
            :value="val"
            v-model="checked"
            @change="change" />
        <div class="state p-on">
            <div class="statePic" v-html="stateOnPic"></div>
            <label>{{ stateOnLabel }}</label>
        </div>
        <div class="state p-off">
            <div class="statePic" v-html="stateOffPic"></div>
            <label>{{ stateOffLabel }}</label>
        </div>
    </div>
</template>

<script>
    import 'pretty-checkbox/dist/pretty-checkbox.css';
    export default {
        name: 'PrettyCheckBox',
        computed: {
            checked: {
                get () {
                    return this.value
                },
                set (val) {
                    this.checkedProxy = val
                }
            }
        },
        props: {
            value: {
                default: false
            },
            val: {
                default: false
            },
            type: {
                type: String,
                default: 'checkbox'
            },
            name: {
                type: String,
                default: 'PrettyCheckBox'
            },
            stateOnLabel: {
                type: String,
                default: ''
            },
            stateOnPic: {
                type: String,
                default: '' +
                    '<svg version="1.1" width="25" height="25" x="0px" y="0px" viewBox="0 0 341.1 341.8" style="enable-background:new 0 0 341.1 341.8;">\n' +
                    '    <g id="g74" transform="matrix(0.26458333,0,0,0.26458333,7.7861212,7.6966924)">\n' +
                    '        <path id="path10" inkscape:connector-curvature="0" class="st0" d="M1119.1,1141.9c-197.5,161.3-814.4,161.3-1007.9,0    c-197.5-161.3-177.4-850.6,0-1032.1s830.5-181.4,1007.9,0S1316.7,980.6,1119.1,1141.9z"></path>\n' +
                    '        <g id="g14" class="st1">\n' +
                    '            <path id="path12" inkscape:connector-curvature="0" class="st2" d="M619.2,859.7c-177.4,141.1-374.9,213.7-560.4,217.7     C-78.2,843.6-50,275.1,111.3,109.8C256.4-39.3,712-67.5,974,25.2C1038.5,291.3,905.5,629.9,619.2,859.7L619.2,859.7z"></path>\n' +
                    '        </g>\n' +
                    '        <path id="path16" inkscape:connector-curvature="0" class="st2" d="M441.7,1157.1c-39.2,0-78.4-16.8-100.8-50.4L27.2,703.3    c-44.8-56-33.6-134.4,22.4-179.3s134.4-33.6,179.3,22.4l212.9,274.5l470.6-610.6c44.8-56,123.2-67.2,179.3-22.4    s67.2,123.2,22.4,179.3l-571.4,739.5C514.6,1134.7,481,1157.1,441.7,1157.1z"></path>\n' +
                    '    </g>\n' +
                    '</svg>'
            },
            stateOffLabel: {
                type: String,
                default: ''
            },
            stateOffPic: {
                type: String,
                default: '' +
                    '<svg version="1.1" width="25" height="25"  x="0px" y="0px" viewBox="0 0 341.1 341.6" style="enable-background:new 0 0 341.1 341.6;">\n' +
                    '    <g id="g26" transform="matrix(0.26458333,0,0,0.26458333,51.253383,19.413955)">\n' +
                    '        <path id="path10" inkscape:connector-curvature="0" class="st0" d="M954.9,1096.7c-197.5,161.3-814.4,161.3-1007.9,0    C-250.6,935.4-230.4,246-53,64.6s830.5-181.4,1007.9,0S1152.4,935.4,954.9,1096.7z"></path>\n' +
                    '        <g id="g14" transform="translate(-192.85715,594.28572)" class="st1">\n' +
                    '            <path id="path12" inkscape:connector-curvature="0" class="st2" d="M647.8,220.2C470.4,361.3,272.9,433.8,87.4,437.9     C-49.6,204-21.4-364.4,139.8-529.7c145.1-149.2,600.7-177.4,862.7-84.7C1067.1-348.3,934.1-9.6,647.8,220.2L647.8,220.2z"></path>\n' +
                    '        </g>\n' +
                    '        <path id="path10-0" inkscape:connector-curvature="0" class="st2" d="M840.1,963.3C690.7,1085,224.3,1085,78,963.3    c-149.4-121.7-134.1-642.1,0-779s628-136.9,762.1,0S989.4,841.6,840.1,963.3z"></path>\n' +
                    '    </g>\n' +
                    '</svg>'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                checkedProxy: false
            }
        },
        created() {
            this.checkedProxy = this.value;
        },
        methods: {
            change(val) {
                // :checked="val === value"
                // this.$emit('input', val);

                this.$emit('input', this.checkedProxy);
                this.$emit('changed', this.checkedProxy);
            }
        }
    }
</script>

<style lang="scss">
    .SearchToolCheckBox {
        .state {
            .statePic {
                display: inline-block;
            }
        }
        .state.p-off .st0{fill:#FF9000;}
        .state.p-off .st1{opacity:0.2;}
        .state.p-off .st2{fill:#FFFFFF;}

        .state.p-on .st0{fill:#FF9000;}
        .state.p-on .st1{opacity:0.2;}
        .state.p-on .st2{fill:#FFFFFF;}

        .pretty .state label {
            text-indent: 0.1em;
        }
    }
</style>
