<template>
    <div class="ww-color" :style="style"></div>
</template>
 

<script>
export default {
    name: "ww-color",
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            el: null,
        };
    },
    computed: {
        wwObject() {
            return this.wwObjectCtrl.get();
        },
        style() {
            if (!this.el) {
                return {}
            }

            this.wwObject.content.data.style = this.wwObject.content.data.style || {};

            let styles = {}
            styles.background = this.wwObject.content.data.backgroundColor || 'transparent'
            styles.backgroundImage = this.wwObject.content.data.gradient || '';

            styles.paddingBottom = this.wwAttrs.wwCategory == 'background' ? '' : (Math.max(0, this.wwObject.ratio) || 66.66) + '%';


            //FORMAT
            styles.boxShadow = this.getShadow();

            //BORDER
            const w = this.$el.getBoundingClientRect().width;

            const borderRadius = w * (this.wwObject.content.data.style.borderRadius ? this.wwObject.content.data.style.borderRadius : 0) / 100;
            styles.borderRadius = borderRadius + 'px';

            const borderWidth = w * (this.wwObject.content.data.style.borderWidth ? this.wwObject.content.data.style.borderWidth : 0) / 100;
            styles.borderWidth = borderWidth + 'px';

            styles.borderColor = this.wwObject.content.data.style.borderColor || 'black';
            styles.borderStyle = this.wwObject.content.data.style.borderStyle || 'none';

            return styles;

        }
    },
    watch: {
    },
    beforeDestroy() { },
    methods: {

        getShadow() {
            this.wwObject.content.data.style = this.wwObject.content.data.style || {};


            const shadow = this.wwObject.content.data.style.boxShadow || {};
            if (shadow.x || shadow.y || shadow.b || shadow.s || shadow.c) {
                return shadow.x + 'px ' + shadow.y + 'px ' + shadow.b + 'px ' + shadow.s + 'px ' + shadow.c;
            }
            return '';
        },

        /* wwManager:start */
        async changeColor() {
            wwLib.wwObjectHover.setLock(this);

            let options = {
                firstPage: 'COLOR_PICKER'
            }

            try {
                const result = await wwLib.wwPopups.open(options)
                this.wwObject.content.data.backgroundColor = result.color;

                this.wwObjectCtrl.update(this.wwObject);
            } catch (error) {

            }

            wwLib.wwObjectHover.removeLock();
        },
        async edit() {
            wwLib.wwObjectHover.setLock(this);

            let editList = {
                SELECT_COLOR: {
                    separator: {
                        en_GB: 'Color / Gradient',
                        fr_FR: 'Couleur / Dégradé'
                    },
                    title: {
                        en_GB: 'Select color',
                        fr_FR: 'Sélectionner une couleur'
                    },
                    desc: {
                        en_GB: '',
                        fr_FR: ''
                    },
                    icon: 'wwi wwi-color',
                    shortcut: 'c',
                    next: 'COLOR_PICKER'
                },
                SELECT_GRADIENT: {
                    title: {
                        en_GB: 'Select gradiant',
                        fr_FR: 'Sélectionner un dégradé'
                    },
                    desc: {
                        en_GB: 'Generate a gradient',
                        fr_FR: 'Générer un dégradé'
                    },
                    icon: 'wwi wwi-color',
                    shortcut: 'c',
                    next: 'GRADIENT'
                },
                EDIT_STYLE: {
                    separator: {
                        en_GB: 'Style',
                        fr_FR: 'Style'
                    },
                    title: {
                        en_GB: 'Change color style',
                        fr_FR: 'Changer l\'apparence de la couleur'
                    },
                    desc: {
                        en_GB: 'Borders, shadow, ...',
                        fr_FR: 'Bordures, ombres, ...'
                    },
                    icon: 'wwi wwi-edit-style',
                    shortcut: 's',
                    next: 'WWCOLOR_STYLE'
                },
                EDIT_RATIO: {
                    title: {
                        en_GB: 'Change color ratio',
                        fr_FR: 'Changer le ratio de la couleur'
                    },
                    desc: {
                        en_GB: 'Portrait, square, landscape, ...',
                        fr_FR: 'Portrait, carré, paysage, ...'
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
                    en_GB: 'Edit Color',
                    fr_FR: 'Editer la couleur'
                },
                type: 'wwPopupEditWwObject',
                buttons: null,
                storyData: {
                    list: editList
                }
            })
            wwLib.wwPopups.addStory('WWCOLOR_RATIO', {
                title: {
                    en_GB: 'Color Ratio',
                    fr_FR: 'Ratio de la couleur'
                },
                type: 'wwPopupImageRatio',
                buttons: {
                    NEXT: {
                        text: {
                            en_GB: 'Next',
                            fr_FR: 'Suivant'
                        },
                        next: 'WWCOLOR_STYLE'
                    }
                }
            })
            wwLib.wwPopups.addStory('WWCOLOR_STYLE', {
                title: {
                    en_GB: 'Color style',
                    fr_FR: 'Style de la couleur'
                },
                type: 'wwPopupImageStyle',
                buttons: {
                    OK: {
                        text: {
                            en_GB: 'Ok',
                            fr_FR: 'Valider'
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
                    this.wwObject.content.data.backgroundColor = result.color;
                    this.wwObject.content.data.gradient = null;
                }
                if (typeof (result.gradient) != 'undefined') {
                    this.wwObject.content.data.gradient = result.gradient;
                }
                if (typeof (result.gradientColor) != 'undefined') {
                    this.wwObject.content.data.color = result.gradientColor;
                }

                /*=============================================m_ÔÔ_m=============================================\
                  STYLE
                \================================================================================================*/
                if (typeof (result.ratio) != 'undefined') {
                    this.wwObject.ratio = result.ratio;
                }
                if (typeof (result.borderColor) != 'undefined') {
                    this.wwObject.content.data.style.borderColor = result.borderColor;
                }
                if (typeof (result.borderRadius) != 'undefined') {
                    this.wwObject.content.data.style.borderRadius = result.borderRadius;
                }
                if (typeof (result.borderStyle) != 'undefined') {
                    this.wwObject.content.data.style.borderStyle = result.borderStyle;
                }
                if (typeof (result.borderWidth) != 'undefined') {
                    this.wwObject.content.data.style.borderWidth = result.borderWidth;
                }
                if (typeof (result.boxShadow) != 'undefined') {
                    this.wwObject.content.data.style.boxShadow = result.boxShadow;
                }


                this.wwObjectCtrl.update(this.wwObject);

                this.wwObjectCtrl.globalEdit(result);

            } catch (error) {
                console.log(error);
            }

            wwLib.wwObjectHover.removeLock();
        }
        /* wwManager:end */
    },
    mounted() {

        this.el = this.$el;


        wwLib.wwElementsStyle.applyAllStyles({
            wwObject: this.wwObject,
            lastWwObject: null,
            element: this.$el,
            noClass: false,
            noAnim: this.wwAttrs.wwNoAnim,
        });
        this.$emit('ww-loaded', this);
    }
};
</script>

<style scoped>
</style>
