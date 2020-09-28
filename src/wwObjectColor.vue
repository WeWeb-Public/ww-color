<template>
    <div class="ww-color" :style="style"></div>
</template>
 

<script>
export default {
    name: "__COMPONENT_NAME__",
    props: {
        uid: Number,
        content: Object,
    },
    wwDefaultContent: {
        backgroundColor: 'transparent'
    },
    computed: {
        style() {
            const { backgroundColor } = this.content
            return { background: backgroundColor }
        }
    },
};
</script>

<style scoped lang="scss">
.ww-color {
    position: relative;
}
</style>
