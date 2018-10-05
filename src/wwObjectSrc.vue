<template>
	<div>
	</div>
</template>
 

<script>
export default {
	name: "ww-color",
	props: {
		wwObject: {
			type: Object,
			default: {}
		},
		wwAttrs: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {};
	},
	computed: {
	},
	watch: {
	},
	beforeDestroy() { },
	methods: {
		wwGetRatio: function () {
			//If ratio is fixed in ww-object directive, override it here
			if (this.wwAttrs.wwFixedRatio) {
				try {
					var ratio = parseFloat(this.wwAttrs.wwFixedRatio);
					if (ratio) {
						return ratio;
					}
				}
				catch (error) {
					console.log("wwRatio error", error);
				}
			}

			if (!this.wwObject.ratio || this.wwObject.ratio < 0) {
				if (this.wwAttrs.wwDefaultRatio) {
					return this.wwAttrs.wwDefaultRatio;
				}
				else {
					return 100 / 3 * 2;
				}
			}

			return this.wwObject.ratio;
		},
		wwApplyRatio: function (ratio) {
			if (this.wwAttrs.wwCategory != "background") {
				var _ratio = ratio || this.wwGetRatio();

				this.wwImgElements.wwImgFormat.style.paddingBottom = _ratio + "%";
			}
		}
	},
	mounted() {
		this.wwApplyRatio()
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
