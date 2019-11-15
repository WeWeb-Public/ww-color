<template>
    <div class="ww-color" :style="style">
        {{wwObject.style.backgroundColor}}
        <!-- <wwLayoutColumn v-if="wwAttrs.wwCategory !='background'" tag="div" ww-default="ww-text" ww-align="middle" :ww-list="wwObject.data.wwObjects" class="ww-color-layout" @ww-add="wwAdd(wwObject.data.wwObjects, $event)" @ww-remove="wwRemove(wwObject.data.wwObjects, $event)">
            <wwObject v-for="wwObj in wwObject.data.wwObjects" :key="wwObj.uniqueId" :ww-object="wwObj" ww-inside-ww-object="ww-color"></wwObject>
        </wwLayoutColumn>-->
    </div>
</template>
 

<script>
export default {
    name: "__COMPONENT_NAME__",
    props: {
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
        };
    },
    computed: {
        style() {
            let styles = {}
            styles.background = this.wwObject.style.backgroundColor || 'transparent'
            styles.backgroundImage = this.wwObject.style.gradient || '';

            let ratio = 100;
            if (this.wwAttrs.wwFixedRatio) {
                try {
                    ratio = parseFloat(this.wwAttrs.wwFixedRatio);
                }
                catch (error) {
                    console.log("wwRatio error", error);
                }
            }
            else {
                ratio = this.wwObject.ratio;
            }

            styles.paddingBottom = this.wwAttrs.wwCategory == 'background' ? '' : (Math.max(0, ratio) || 66.66) + '%';


            //FORMAT
            styles.boxShadow = this.getShadow();

            //BORDER


            const unit = this.wwObject.style.borderRadiusUnit || '%';
            const borderRadius = (this.wwObject.style.borderRadius / (unit == '%' ? 2 : 1)) + unit;
            styles.borderRadius = borderRadius;

            const borderWidth = this.wwObject.style.borderWidth || 0;
            styles.borderWidth = borderWidth + 'px';

            styles.borderColor = this.wwObject.style.borderColor || 'black';
            styles.borderStyle = this.wwObject.style.borderStyle || 'none';

            return styles;

        }
    },
    watch: {
    },
    beforeDestroy() { },
    methods: {
        wwData() {
            return {
                backgroundColor: 'transparent',
                wwObjects: []
            }
        },

        getShadow() {
            const shadow = this.wwObject.style.boxShadow || {};
            if (shadow.x || shadow.y || shadow.b || shadow.s || shadow.c) {
                return shadow.x + 'px ' + shadow.y + 'px ' + shadow.b + 'px ' + shadow.s + 'px ' + shadow.c;
            }
            return '';
        },

        /* wwManager:start */
        wwAdd(list, options) {
            list.splice(options.index, 0, options.wwObject);
        },
        wwRemove(list, options) {
            list.splice(options.index, 1);
        },
        async changeColor() {
            wwLib.wwObjectHover.setLock(this);

            let options = {
                firstPage: 'COLOR_PICKER',
                data: {
                    wwObject: this.wwObject.clone()
                }
            }

            try {
                const result = await wwLib.wwPopups.open(options)

                if (typeof (result.color) != 'undefined') {
                    this.wwObject.style.backgroundColor = result.color;
                    this.wwObject.style.gradient = null;
                }
            } catch (error) {
                console.log("ERROR", error);
            }

            wwLib.wwObjectHover.removeLock();
        },
        async edit() {
            wwLib.wwObjectHover.setLock(this);

            let editList = {
                SELECT_COLOR: {
                    separator: {
                        en: 'Color / Gradient',
                        fr: 'Couleur / Dégradé'
                    },
                    title: {
                        en: 'Select color',
                        fr: 'Sélectionner une couleur'
                    },
                    desc: {
                        en: '',
                        fr: ''
                    },
                    icon: 'wwi wwi-color',
                    shortcut: 'c',
                    next: 'COLOR_PICKER'
                },
                SELECT_GRADIENT: {
                    title: {
                        en: 'Select gradiant',
                        fr: 'Sélectionner un dégradé'
                    },
                    desc: {
                        en: 'Generate a gradient',
                        fr: 'Générer un dégradé'
                    },
                    icon: 'wwi wwi-color',
                    shortcut: 'c',
                    next: 'GRADIENT'
                },
                EDIT_STYLE: {
                    separator: {
                        en: 'Style',
                        fr: 'Style'
                    },
                    title: {
                        en: 'Change color style',
                        fr: 'Changer l\'apparence de la couleur'
                    },
                    desc: {
                        en: 'Borders, shadow, ...',
                        fr: 'Bordures, ombres, ...'
                    },
                    icon: 'wwi wwi-edit-style',
                    shortcut: 's',
                    next: 'WWCOLOR_STYLE'
                },
                EDIT_RATIO: {
                    title: {
                        en: 'Change color ratio',
                        fr: 'Changer le ratio de la couleur'
                    },
                    desc: {
                        en: 'Portrait, square, landscape, ...',
                        fr: 'Portrait, carré, paysage, ...'
                    },
                    icon: 'wwi wwi-ratio',
                    shortcut: 'r',
                    next: 'WWCOLOR_RATIO'
                }
            }

            if (this.wwAttrs.wwCategory == 'background') {
                delete editList.EDIT_RATIO;
            }

            wwLib.wwPopups.addStory('WWCOLOR_EDIT', {
                title: {
                    en: 'Edit Color',
                    fr: 'Editer la couleur'
                },
                type: 'wwPopupEditWwObject',
                buttons: null,
                storyData: {
                    list: editList
                }
            })
            wwLib.wwPopups.addStory('WWCOLOR_RATIO', {
                title: {
                    en: 'Color Ratio',
                    fr: 'Ratio de la couleur'
                },
                type: 'wwPopupWwObjectRatio',
                buttons: {
                    NEXT: {
                        text: {
                            en: 'Next',
                            fr: 'Suivant'
                        },
                        next: 'WWCOLOR_STYLE'
                    }
                }
            })
            wwLib.wwPopups.addStory('WWCOLOR_STYLE', {
                title: {
                    en: 'Color style',
                    fr: 'Style de la couleur'
                },
                type: 'wwPopupWwObjectStyle',
                buttons: {
                    OK: {
                        text: {
                            en: 'Ok',
                            fr: 'Valider'
                        },
                        next: false
                    }
                }
            })

            let options = {
                firstPage: 'WWCOLOR_EDIT',
                data: {
                    wwObject: this.wwObject
                }
            }

            try {
                const result = await wwLib.wwPopups.open(options);

                /*=============================================m_ÔÔ_m=============================================\
                  COLOR
                \================================================================================================*/
                if (typeof (result.color) != 'undefined') {
                    this.wwObject.style.backgroundColor = result.color;
                    this.wwObject.style.gradient = null;
                }
                if (typeof (result.gradient) != 'undefined') {
                    this.wwObject.style.gradient = result.gradient;
                    this.wwObject.style.backgroundColor = null;
                }
                if (typeof (result.gradientColor) != 'undefined') {
                    this.wwObject.style.color = result.gradientColor;
                }

                /*=============================================m_ÔÔ_m=============================================\
                  STYLE
                \================================================================================================*/
                if (typeof (result.ratio) != 'undefined') {
                    this.wwObject.ratio = result.ratio;
                }
                if (typeof (result.borderColor) != 'undefined') {
                    this.wwObject.style.borderColor = result.borderColor;
                }
                if (typeof (result.borderRadius) != 'undefined') {
                    this.wwObject.style.borderRadius = result.borderRadius;
                }
                if (typeof (result.borderRadiusUnit) != 'undefined') {
                    this.wwObject.style.borderRadiusUnit = result.borderRadiusUnit;
                }
                if (typeof (result.borderStyle) != 'undefined') {
                    this.wwObject.style.borderStyle = result.borderStyle;
                }
                if (typeof (result.borderWidth) != 'undefined') {
                    this.wwObject.style.borderWidth = result.borderWidth;
                }
                if (typeof (result.boxShadow) != 'undefined') {
                    this.wwObject.style.boxShadow = result.boxShadow;
                }


                // this.wwObjectCtrl.update(this.wwObject);

                this.getWwObjectComponent().globalEdit(result);

            } catch (error) {
                console.log(error);
            }

            wwLib.wwObjectHover.removeLock();
        },


        migrateData() {
            console.log("MIGRATED", this.wwObject.style);
            if (this.wwObject.data.backgroundColor) {
                this.wwObject.style.backgroundColor = this.wwObject.data.backgroundColor;
                delete this.wwObject.data.backgroundColor;
            }
            if (this.wwObject.data.gradient) {
                this.wwObject.style.gradient = this.wwObject.data.gradient;
                delete this.wwObject.data.gradient;
            }
        },
        /* wwManager:end */
    },
    mounted() {
        this.$emit('ww-loaded', this);

        setTimeout(() => {
            this.wwObject.style.backgroundColor = '#00FF00'
            setTimeout(() => {
                this.wwObject.style.backgroundColor = '#0000FF'
            }, 3000)
        }, 3000)

        // console.log(this.wwObject);
    },
    created() {
        /* wwManager:start */
        this.migrateData();
        /* wwManager:end */
    }
};
</script>

<style scoped>
</style>
