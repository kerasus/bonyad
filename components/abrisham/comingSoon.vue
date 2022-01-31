<template>
    <div class="main">
        <div class="coming-soon-winSize">
<!--           ! DON'T TOUCH !-->
            size :  {{windowsSize}}
        </div>
        <div
            id="coming-soon-desktop"
            class="coming-soon-image"
        >
        </div>
        <div
            id="coming-soon-mobile"
            class="coming-soon-mobile"
        >
        </div>
        <p class="coming-soon">
            ...به زودی
        </p>
        <p class="coming-soon-description">
            این بخش هنوز آماده نیست ولی به زودی آماده و فعال میشه.
        </p>

    </div>
</template>

<script>
import lottie from 'lottie-web'

export default {
    name: 'ComingSoon',
    components: {
        lottie
    },
    created() {
    },
    mounted() {
        this.reInit()
    },
    data() {
        return {
            currentAnimation : null,
            animType : '',

        }
    },
    watch:{
        animType : function (){
            this.reInit()
        }
    },
    computed:{
        windowsSize(){
            if (this.$store.getters.windowSize.x < 960){
              return  this.animType = 'mobile'
            }
            return this.animType = 'desktop'
        },
    },
    methods: {
        initAnim(){
            this.currentAnimation = lottie.loadAnimation( this.getLottieConfig())
        },
        getDynamicConfig(){
            const pickedType = this.animType
            const animationConfig = {
                mobile : {
                    name: 'coming-soon-mobile',
                    assetsPath: 'https://nodes.alaatv.com/upload/abrishamDashboard/abrisham-dashboard-bodymovin-comingSoon/mobile/images/',
                    jsonPath: 'https://nodes.alaatv.com/upload/abrishamDashboard/abrisham-dashboard-bodymovin-comingSoon/mobile/data.json'
                },
                desktop : {
                    name: 'coming-soon-desktop',
                    assetsPath: 'https://nodes.alaatv.com/upload/abrishamDashboard/abrisham-dashboard-bodymovin-comingSoon/desktop/images/',
                    jsonPath: 'https://nodes.alaatv.com/upload/abrishamDashboard/abrisham-dashboard-bodymovin-comingSoon/desktop/data.json'
                }
            }
            var pickedConfig = {}
            for (const key in animationConfig) {
                if (animationConfig.hasOwnProperty(key) && key === pickedType) {
                    pickedConfig = animationConfig[key]
                }
            }
            return pickedConfig
        },
        getLottieConfig(){
            const dynamicConfig = this.getDynamicConfig()
            return {
                container: document.querySelector(`#${dynamicConfig.name}`),
                path: dynamicConfig.jsonPath,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                assetsPath: dynamicConfig.assetsPath
            }
        },
        destroyAnim(){
            this.currentAnimation.destroy()
        },
        reInit() {
            if (this.currentAnimation !== null){
                this.destroyAnim()
                // this.initAnim()
            }
            // else {
            this.initAnim()
            // }
        }
    },
    destroyed() {
        this.destroyAnim()
    }
}
</script>

<style scoped>
#animation {
    width: 200px;
}
.main{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.main .coming-soon-image{
    width: 873px;
    height: 454px;
    margin: 114px 440px;
}
.main .coming-soon-mobile{
    display: none;
}
.main .coming-soon{
    text-align: center;
    font-size: 40px;
    font-weight: 500;
    color: #3e5480;
}
.main .coming-soon-description{
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    color: #9fa5c0;
}
.coming-soon-winSize{
    display: none;
}
@media screen and (max-width: 1200px) {
    .main .coming-soon-image{
        width: 600px;
        height: 311px;
        margin: 80px 30px;
    }
}
@media screen and (max-width: 960px){
    .main .coming-soon-image{
        display: none !important;
    }
    .main .coming-soon-mobile {
        display: block !important;
        width: 427px;
        height: 569px;
        margin: 109px 75px;
    }
}
@media screen and (max-width: 768px){
    .main .coming-soon-mobile {
        width: 427px;
        height: 569px;
        margin: 109px 82px ;
    }
    .main .coming-soon{
        font-size: 24px;
    }
    .main .coming-soon-description{
        font-size: 14px;
    }
}
@media screen and (max-width: 576px){
    .main .coming-soon-mobile {
        width: 257px;
        height: 342px;
        margin: 35px 23px;
    }
    .main .coming-soon{
        font-size: 24px;
    }
    .main .coming-soon-description{
        font-size: 14px;
        width: 177px;
        height: 48px;
    }
}
@media screen and (max-width: 350px) {
    .main .coming-soon-description{
        font-size: 14px;
        width: 177px;
        height: 48px;
    }
}
</style>
