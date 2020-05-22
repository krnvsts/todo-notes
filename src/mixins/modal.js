export default {
	data: () => ({
		isShowModal: false,
		typeModal: "delete"
	}),
	methods: {
		showModal(type) {
			this.typeModal = type
			this.isShowModal = true;
		},
		hideWindow() {
			this.isShowModal = false;
		},
	}
}
