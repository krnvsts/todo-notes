export default {
	data: () => ({
		isShowModal: false,
		typeModal: "delete"
	}),
	methods: {
		showModal() {
			this.isShowModal = true;
		},
		hideWindow() {
			this.isShowModal = false;
		},
	}
}
