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
        backgroundColor: 'red'
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
    min-height: 50px;
    min-width: 50px;
}
</style>
