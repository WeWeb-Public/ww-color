import wwObject from './wwObjectColor.vue'

const name = "ww-color";

const addComponent = function () {
    if (window.vm) {

        wwLib.wwObject.register({
            content: {
                type: name,
                data: {
                    backgroundColor: "transparent",
                    style: {
                        borderRadius: 0,
                        borderWidth: 0,
                        borderColor: null,
                        borderStyle: null,
                        boxShadow: {
                            x: 0,
                            y: 0,
                            b: 0,
                            s: 0,
                            c: ''
                        },
                    },
                }
            },
            upsales: {
                wwAnalytics: {
                    click: false
                }
            },
            /* wwManager:start */
            cmsOptions: {
                wwObjectMenu: {
                    items: [
                        {
                            name: 'OPTIONS',
                            text: {
                                en_GB: 'Options...',
                                fr_FR: 'Options...'
                            },
                            icon: 'wwi wwi-edit-other',
                            action: 'edit'
                        },
                        {
                            name: 'COLOR',
                            text: {
                                en_GB: 'Color',
                                fr_FR: 'Couleur'
                            },
                            icon: 'wwi wwi-color',
                            action: 'changeColor'
                        }
                    ]
                }
            }
            /* wwManager:end */
        });

        window.vm.addComponent(name, wwObject);

        return true;
    }
    return false;
}

if (!addComponent()) {
    const iniInterval = setInterval(function () {
        if (addComponent()) {
            clearInterval(iniInterval);
        }
    }, 10);
}