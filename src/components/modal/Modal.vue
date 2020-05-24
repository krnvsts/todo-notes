<template>
  <div class="modal">
    <div @click="hideWindow" class="modal__wrapper">
      <div class="modal__window">
        <icon-base>
          <icon-error v-if="typeModal == 'delete'" />
          <icon-warning v-else />
        </icon-base>
        <p>{{ type[typeModal].title }}?</p>
        <button @click="confirm()">{{ type[typeModal].buton }}</button>
        <button @click="hideWindow">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
// icon
import IconBase from "../icons/IconBase.vue";
import IconWarning from "../icons/IconWarning.vue";
import IconError from "../icons/IconError.vue";

export default {
  name: "Modal",
  components: {
    IconBase,
    IconWarning,
    IconError
  },
  data: () => ({
    type: {
      delete: {
        title: "Удалить заметку",
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
      this.$emit("modalConfirm");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

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
    border-radius: $brd;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 285px;
    padding: 55px;
    z-index: 2000;
    animation: scale 50ms linear;
    box-shadow: $shadow;
  }
}

@keyframes scale {
  from {
    transform: translate(-50%, -50%) scale(0.5);
  }
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
