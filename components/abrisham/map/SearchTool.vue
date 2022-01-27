<template>

    <div>
        <div>
            <div
                v-for="(item, index) in filterItems.reshte"
                class="SearchToolCheckBox pretty p-icon p-plain p-toggle">
                <input type="checkbox" v-model="item.selected" @change="changed" />
                <div class="state p-on">
                    <svg version="1.1" width="25" height="25" x="0px" y="0px" viewBox="0 0 341.1 341.8" style="enable-background:new 0 0 341.1 341.8;">
                        <g id="g74" transform="matrix(0.26458333,0,0,0.26458333,7.7861212,7.6966924)">
                            <path id="path10" inkscape:connector-curvature="0" class="st0" d="M1119.1,1141.9c-197.5,161.3-814.4,161.3-1007.9,0    c-197.5-161.3-177.4-850.6,0-1032.1s830.5-181.4,1007.9,0S1316.7,980.6,1119.1,1141.9z"></path>
                            <g id="g14" class="st1">
                                <path id="path12" inkscape:connector-curvature="0" class="st2" d="M619.2,859.7c-177.4,141.1-374.9,213.7-560.4,217.7     C-78.2,843.6-50,275.1,111.3,109.8C256.4-39.3,712-67.5,974,25.2C1038.5,291.3,905.5,629.9,619.2,859.7L619.2,859.7z"></path>
                            </g>
                            <path id="path16" inkscape:connector-curvature="0" class="st2" d="M441.7,1157.1c-39.2,0-78.4-16.8-100.8-50.4L27.2,703.3    c-44.8-56-33.6-134.4,22.4-179.3s134.4-33.6,179.3,22.4l212.9,274.5l470.6-610.6c44.8-56,123.2-67.2,179.3-22.4    s67.2,123.2,22.4,179.3l-571.4,739.5C514.6,1134.7,481,1157.1,441.7,1157.1z"></path>
                        </g>
                    </svg>
                    <label>{{ item.name }}</label>
                </div>
                <div class="state p-off">
                    <svg version="1.1" width="25" height="25"  x="0px" y="0px" viewBox="0 0 341.1 341.6" style="enable-background:new 0 0 341.1 341.6;">
                        <g id="g26" transform="matrix(0.26458333,0,0,0.26458333,51.253383,19.413955)">
                            <path id="path10" inkscape:connector-curvature="0" class="st0" d="M954.9,1096.7c-197.5,161.3-814.4,161.3-1007.9,0    C-250.6,935.4-230.4,246-53,64.6s830.5-181.4,1007.9,0S1152.4,935.4,954.9,1096.7z"></path>
                            <g id="g14" transform="translate(-192.85715,594.28572)" class="st1">
                                <path id="path12" inkscape:connector-curvature="0" class="st2" d="M647.8,220.2C470.4,361.3,272.9,433.8,87.4,437.9     C-49.6,204-21.4-364.4,139.8-529.7c145.1-149.2,600.7-177.4,862.7-84.7C1067.1-348.3,934.1-9.6,647.8,220.2L647.8,220.2z"></path>
                            </g>
                            <path id="path10-0" inkscape:connector-curvature="0" class="st2" d="M840.1,963.3C690.7,1085,224.3,1085,78,963.3    c-149.4-121.7-134.1-642.1,0-779s628-136.9,762.1,0S989.4,841.6,840.1,963.3z"></path>
                        </g>
                    </svg>
                    <label>{{ item.name }}</label>
                </div>
            </div>
        </div>
        <hr>
        <!-- path -->
        <div>
            <div
                v-for="(item, index) in filterItems.path"
                class="SearchToolCheckBox pretty p-icon p-plain p-toggle">
                <input type="checkbox" v-model="item.selected" @change="changed" />
                <div class="state p-on">
                    <svg version="1.1" width="25" height="25" x="0px" y="0px" viewBox="0 0 341.1 341.8" style="enable-background:new 0 0 341.1 341.8;">
                        <g id="g74" transform="matrix(0.26458333,0,0,0.26458333,7.7861212,7.6966924)">
                            <path id="path10" inkscape:connector-curvature="0" class="st0" d="M1119.1,1141.9c-197.5,161.3-814.4,161.3-1007.9,0    c-197.5-161.3-177.4-850.6,0-1032.1s830.5-181.4,1007.9,0S1316.7,980.6,1119.1,1141.9z"></path>
                            <g id="g14" class="st1">
                                <path id="path12" inkscape:connector-curvature="0" class="st2" d="M619.2,859.7c-177.4,141.1-374.9,213.7-560.4,217.7     C-78.2,843.6-50,275.1,111.3,109.8C256.4-39.3,712-67.5,974,25.2C1038.5,291.3,905.5,629.9,619.2,859.7L619.2,859.7z"></path>
                            </g>
                            <path id="path16" inkscape:connector-curvature="0" class="st2" d="M441.7,1157.1c-39.2,0-78.4-16.8-100.8-50.4L27.2,703.3    c-44.8-56-33.6-134.4,22.4-179.3s134.4-33.6,179.3,22.4l212.9,274.5l470.6-610.6c44.8-56,123.2-67.2,179.3-22.4    s67.2,123.2,22.4,179.3l-571.4,739.5C514.6,1134.7,481,1157.1,441.7,1157.1z"></path>
                        </g>
                    </svg>
                    <label>{{ item.name }}</label>
                </div>
                <div class="state p-off">
                    <svg version="1.1" width="25" height="25"  x="0px" y="0px" viewBox="0 0 341.1 341.6" style="enable-background:new 0 0 341.1 341.6;">
                        <g id="g26" transform="matrix(0.26458333,0,0,0.26458333,51.253383,19.413955)">
                            <path id="path10" inkscape:connector-curvature="0" class="st0" d="M954.9,1096.7c-197.5,161.3-814.4,161.3-1007.9,0    C-250.6,935.4-230.4,246-53,64.6s830.5-181.4,1007.9,0S1152.4,935.4,954.9,1096.7z"></path>
                            <g id="g14" transform="translate(-192.85715,594.28572)" class="st1">
                                <path id="path12" inkscape:connector-curvature="0" class="st2" d="M647.8,220.2C470.4,361.3,272.9,433.8,87.4,437.9     C-49.6,204-21.4-364.4,139.8-529.7c145.1-149.2,600.7-177.4,862.7-84.7C1067.1-348.3,934.1-9.6,647.8,220.2L647.8,220.2z"></path>
                            </g>
                            <path id="path10-0" inkscape:connector-curvature="0" class="st2" d="M840.1,963.3C690.7,1085,224.3,1085,78,963.3    c-149.4-121.7-134.1-642.1,0-779s628-136.9,762.1,0S989.4,841.6,840.1,963.3z"></path>
                        </g>
                    </svg>
                    <label>{{ item.name }}</label>
                </div>
            </div>
            <hr>
        </div>
        <!-- steps -->
        <div
            v-if="selectedPath"
        >
            <div>
                <div
                    v-for="(item, index) in allSelectedSteps"
                    class="SearchToolCheckBox pretty p-icon p-plain p-toggle">
                    <input type="checkbox" v-model="item.selected" @change="changed" />
                    <div class="state p-on">
                        <svg version="1.1" width="25" height="25" x="0px" y="0px" viewBox="0 0 341.1 341.8" style="enable-background:new 0 0 341.1 341.8;">
                            <g id="g74" transform="matrix(0.26458333,0,0,0.26458333,7.7861212,7.6966924)">
                                <path id="path10" inkscape:connector-curvature="0" class="st0" d="M1119.1,1141.9c-197.5,161.3-814.4,161.3-1007.9,0    c-197.5-161.3-177.4-850.6,0-1032.1s830.5-181.4,1007.9,0S1316.7,980.6,1119.1,1141.9z"></path>
                                <g id="g14" class="st1">
                                    <path id="path12" inkscape:connector-curvature="0" class="st2" d="M619.2,859.7c-177.4,141.1-374.9,213.7-560.4,217.7     C-78.2,843.6-50,275.1,111.3,109.8C256.4-39.3,712-67.5,974,25.2C1038.5,291.3,905.5,629.9,619.2,859.7L619.2,859.7z"></path>
                                </g>
                                <path id="path16" inkscape:connector-curvature="0" class="st2" d="M441.7,1157.1c-39.2,0-78.4-16.8-100.8-50.4L27.2,703.3    c-44.8-56-33.6-134.4,22.4-179.3s134.4-33.6,179.3,22.4l212.9,274.5l470.6-610.6c44.8-56,123.2-67.2,179.3-22.4    s67.2,123.2,22.4,179.3l-571.4,739.5C514.6,1134.7,481,1157.1,441.7,1157.1z"></path>
                            </g>
                        </svg>
                        <label>{{ item.name }}</label>
                    </div>
                    <div class="state p-off">
                        <svg version="1.1" width="25" height="25"  x="0px" y="0px" viewBox="0 0 341.1 341.6" style="enable-background:new 0 0 341.1 341.6;">
                            <g id="g26" transform="matrix(0.26458333,0,0,0.26458333,51.253383,19.413955)">
                                <path id="path10" inkscape:connector-curvature="0" class="st0" d="M954.9,1096.7c-197.5,161.3-814.4,161.3-1007.9,0    C-250.6,935.4-230.4,246-53,64.6s830.5-181.4,1007.9,0S1152.4,935.4,954.9,1096.7z"></path>
                                <g id="g14" transform="translate(-192.85715,594.28572)" class="st1">
                                    <path id="path12" inkscape:connector-curvature="0" class="st2" d="M647.8,220.2C470.4,361.3,272.9,433.8,87.4,437.9     C-49.6,204-21.4-364.4,139.8-529.7c145.1-149.2,600.7-177.4,862.7-84.7C1067.1-348.3,934.1-9.6,647.8,220.2L647.8,220.2z"></path>
                                </g>
                                <path id="path10-0" inkscape:connector-curvature="0" class="st2" d="M840.1,963.3C690.7,1085,224.3,1085,78,963.3    c-149.4-121.7-134.1-642.1,0-779s628-136.9,762.1,0S989.4,841.6,840.1,963.3z"></path>
                            </g>
                        </svg>
                        <label>{{ item.name }}</label>
                    </div>
                </div>
            </div>
            <hr>
        </div>
        <!-- lessons -->
        <div
            v-if="selectedPath"
        >
            <div
                v-for="(item, index) in allSelectedLessons"
                class="SearchToolCheckBox pretty p-icon p-plain p-toggle">
                <input type="checkbox" v-model="item.selected" @change="changed" />
                <div class="state p-on">
                    <svg version="1.1" width="25" height="25" x="0px" y="0px" viewBox="0 0 341.1 341.8" style="enable-background:new 0 0 341.1 341.8;">
                        <g id="g74" transform="matrix(0.26458333,0,0,0.26458333,7.7861212,7.6966924)">
                            <path id="path10" inkscape:connector-curvature="0" class="st0" d="M1119.1,1141.9c-197.5,161.3-814.4,161.3-1007.9,0    c-197.5-161.3-177.4-850.6,0-1032.1s830.5-181.4,1007.9,0S1316.7,980.6,1119.1,1141.9z"></path>
                            <g id="g14" class="st1">
                                <path id="path12" inkscape:connector-curvature="0" class="st2" d="M619.2,859.7c-177.4,141.1-374.9,213.7-560.4,217.7     C-78.2,843.6-50,275.1,111.3,109.8C256.4-39.3,712-67.5,974,25.2C1038.5,291.3,905.5,629.9,619.2,859.7L619.2,859.7z"></path>
                            </g>
                            <path id="path16" inkscape:connector-curvature="0" class="st2" d="M441.7,1157.1c-39.2,0-78.4-16.8-100.8-50.4L27.2,703.3    c-44.8-56-33.6-134.4,22.4-179.3s134.4-33.6,179.3,22.4l212.9,274.5l470.6-610.6c44.8-56,123.2-67.2,179.3-22.4    s67.2,123.2,22.4,179.3l-571.4,739.5C514.6,1134.7,481,1157.1,441.7,1157.1z"></path>
                        </g>
                    </svg>
                    <label>{{ item.name }}</label>
                </div>
                <div class="state p-off">
                    <svg version="1.1" width="25" height="25"  x="0px" y="0px" viewBox="0 0 341.1 341.6" style="enable-background:new 0 0 341.1 341.6;">
                        <g id="g26" transform="matrix(0.26458333,0,0,0.26458333,51.253383,19.413955)">
                            <path id="path10" inkscape:connector-curvature="0" class="st0" d="M954.9,1096.7c-197.5,161.3-814.4,161.3-1007.9,0    C-250.6,935.4-230.4,246-53,64.6s830.5-181.4,1007.9,0S1152.4,935.4,954.9,1096.7z"></path>
                            <g id="g14" transform="translate(-192.85715,594.28572)" class="st1">
                                <path id="path12" inkscape:connector-curvature="0" class="st2" d="M647.8,220.2C470.4,361.3,272.9,433.8,87.4,437.9     C-49.6,204-21.4-364.4,139.8-529.7c145.1-149.2,600.7-177.4,862.7-84.7C1067.1-348.3,934.1-9.6,647.8,220.2L647.8,220.2z"></path>
                            </g>
                            <path id="path10-0" inkscape:connector-curvature="0" class="st2" d="M840.1,963.3C690.7,1085,224.3,1085,78,963.3    c-149.4-121.7-134.1-642.1,0-779s628-136.9,762.1,0S989.4,841.6,840.1,963.3z"></path>
                        </g>
                    </svg>
                    <label>{{ item.name }}</label>
                </div>
            </div>
            <hr>
        </div>
        <!-- teachers -->
        <div
            v-if="teachersOfSelectedLessons.length > 0"
        >
            <div
                v-for="(item, index) in teachersOfSelectedLessons"
                class="SearchToolCheckBox pretty p-icon p-plain p-toggle">
                <input type="checkbox" v-model="item.selected" @change="changed" />
                <div class="state p-on">
                    <svg version="1.1" width="25" height="25" x="0px" y="0px" viewBox="0 0 341.1 341.8" style="enable-background:new 0 0 341.1 341.8;">
                        <g id="g74" transform="matrix(0.26458333,0,0,0.26458333,7.7861212,7.6966924)">
                            <path id="path10" inkscape:connector-curvature="0" class="st0" d="M1119.1,1141.9c-197.5,161.3-814.4,161.3-1007.9,0    c-197.5-161.3-177.4-850.6,0-1032.1s830.5-181.4,1007.9,0S1316.7,980.6,1119.1,1141.9z"></path>
                            <g id="g14" class="st1">
                                <path id="path12" inkscape:connector-curvature="0" class="st2" d="M619.2,859.7c-177.4,141.1-374.9,213.7-560.4,217.7     C-78.2,843.6-50,275.1,111.3,109.8C256.4-39.3,712-67.5,974,25.2C1038.5,291.3,905.5,629.9,619.2,859.7L619.2,859.7z"></path>
                            </g>
                            <path id="path16" inkscape:connector-curvature="0" class="st2" d="M441.7,1157.1c-39.2,0-78.4-16.8-100.8-50.4L27.2,703.3    c-44.8-56-33.6-134.4,22.4-179.3s134.4-33.6,179.3,22.4l212.9,274.5l470.6-610.6c44.8-56,123.2-67.2,179.3-22.4    s67.2,123.2,22.4,179.3l-571.4,739.5C514.6,1134.7,481,1157.1,441.7,1157.1z"></path>
                        </g>
                    </svg>
                    <label>{{ item.name }}</label>
                </div>
                <div class="state p-off">
                    <svg version="1.1" width="25" height="25"  x="0px" y="0px" viewBox="0 0 341.1 341.6" style="enable-background:new 0 0 341.1 341.6;">
                        <g id="g26" transform="matrix(0.26458333,0,0,0.26458333,51.253383,19.413955)">
                            <path id="path10" inkscape:connector-curvature="0" class="st0" d="M954.9,1096.7c-197.5,161.3-814.4,161.3-1007.9,0    C-250.6,935.4-230.4,246-53,64.6s830.5-181.4,1007.9,0S1152.4,935.4,954.9,1096.7z"></path>
                            <g id="g14" transform="translate(-192.85715,594.28572)" class="st1">
                                <path id="path12" inkscape:connector-curvature="0" class="st2" d="M647.8,220.2C470.4,361.3,272.9,433.8,87.4,437.9     C-49.6,204-21.4-364.4,139.8-529.7c145.1-149.2,600.7-177.4,862.7-84.7C1067.1-348.3,934.1-9.6,647.8,220.2L647.8,220.2z"></path>
                            </g>
                            <path id="path10-0" inkscape:connector-curvature="0" class="st2" d="M840.1,963.3C690.7,1085,224.3,1085,78,963.3    c-149.4-121.7-134.1-642.1,0-779s628-136.9,762.1,0S989.4,841.6,840.1,963.3z"></path>
                        </g>
                    </svg>
                    <label>{{ item.name }}</label>
                </div>
            </div>
            <hr>
        </div>

    </div>

</template>

<script>
    export default {
        name: "SearchTool",
        computed: {
            filterItems() {
                return this.$store.getters.appProps.filterItems;
            },
            teachersOfSelectedLessons() {
                if (!this.selectedPath) {
                    return [];
                }
                let lessons = this.selectedPath.lessons.filter(item => item.selected);
                let teachers = lessons.flatMap((item) => item.teachers).filter((value, index, self) => self.indexOf(value) === index).flatMap(item => this.getTeacherByID(item));
                return teachers;
            },
            allSelectedSteps() {
                let abrishamSteps = (this.filterItems.path.abrisham.selected) ? this.filterItems.path.abrisham.steps : [];
                let oghianousSteps = (this.filterItems.path.oghianous.selected) ? this.filterItems.path.oghianous.steps : [];
                let allSelectedSteps = abrishamSteps.concat(oghianousSteps);
                return allSelectedSteps;
            },
            allSelectedLessons() {
                let abrishamLessons = (this.filterItems.path.abrisham.selected) ? this.filterItems.path.abrisham.lessons : [];
                let oghianousLessons = (this.filterItems.path.oghianous.selected) ? this.filterItems.path.oghianous.lessons : [];
                let allSelectedLessons = abrishamLessons.concat(oghianousLessons);
                return allSelectedLessons;
            },
            selectedPath() {
                if (this.filterItems.path.abrisham.selected) {
                    return this.filterItems.path.abrisham;
                } else if (this.filterItems.path.oghianous.selected) {
                    return this.filterItems.path.oghianous;
                } else {
                    return null;
                }
            }
        },
        data() {
            return {
                pathFilter: null
            }
        },
        methods: {
            changed() {
                this.$emit('changed');
            },
            getTeacherByID(id) {
                return this.filterItems.teachers.filter(item => item.id === parseInt(id))
            }
        },
        created() {
        }
    }
</script>

<style scoped>
    .SearchToolCheckBox {
        display: block;
        margin-bottom: 5px;
    }

    .state.p-off .st0{fill:#FF9000;}
    .state.p-off .st1{opacity:0.2;}
    .state.p-off .st2{fill:#FFFFFF;}

    .state.p-on .st0{fill:#FF9000;}
    .state.p-on .st1{opacity:0.2;}
    .state.p-on .st2{fill:#FFFFFF;}
</style>
