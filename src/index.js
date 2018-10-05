import wwObject from './wwObjectSrc.vue'

const name = "ww-color";
const wwEnableMetrics = false;

const addComponent = function () {
    if (window.vm) {

        wwLib.wwObject.registerContentType(
            name,
            {
                type: name,
                data: {
                    backgroundColor: "#ffffff"
                }
            },
            wwEnableMetrics
        );

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