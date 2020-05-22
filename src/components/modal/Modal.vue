<template>
  <div class="modal">
    <div @click="hideWindow" class="modal__wrapper">
      <div class="modal__window">
        <p>{{ type[typeModal].title }}?</p>
        <button @click="confirm(typeModal)">{{ type[typeModal].buton }}</button>
        <button @click="hideWindow">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data: () => ({
    type: {
      delete: {
        title: "Удалить",
        buton: "Удалить"
      },
      editing: {
        title: "Отменить редактирование",
        buton: "Отменить"
      }
    }
  }),
  props: {
    typeModal: {
      type: String,
      default: "delete"
    }
  },
  methods: {
    hideWindow() {
      this.$emit("hideWindow");
    },
    confirm() {
      this.$emit("modalConfirm", this.typeModal);
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  &__wrapper {
    display: block;
    background: #00000055;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
  }

  &__window {
    display: block;
    overflow: hidden;
    position: fixed;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 285px;
    padding: 55px;
    z-index: 2000;
  }
}
</style>
