<template>
	<router-link class="back-button" :to="{ name: 'NoteList' }">
		<icon-base class="back-button__icon">
			<icon-arrow/>
		</icon-base>
		Назад
	</router-link>
</template>

<script>
// icon
import IconBase from "./icons/IconBase.vue";
import IconArrow from "./icons/IconArrow.vue";

export default {
  name: "BackButton",
  components: {
		IconBase,
		IconArrow
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.back-button {
	font-size: 18px;
	text-decoration: none;
	color: $text-color;
	padding: 10px;

	&__icon {
		width: 14px;
    height: 25px;
		color: black;
	}
}
</style>
