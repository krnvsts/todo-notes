export default {
	data: () => ({
		show: false,
	}),
	methods: {
		showWindow() {
			this.show = true;
		},
		hideWindow() {
			this.show = false;
		}
	}
}
