<template>
  <div class="note-item">
    <router-link
      class="note-item__link"
      :to="{
			name: 'NoteAction',
			params: { notesId: note.id }
		}"
    >
      <div class="note-item__title">{{ note.title }}</div>
      <div>{{ note.id }}</div>
      <div class="note-item__content">
        <ul>
          <li v-for="(todo, index) in note.todo" :key="index">
            <span>{{ todo[0] }}</span>
            <span>{{ todo[1] }}</span>
          </li>
        </ul>
      </div>
    </router-link>
    <button @click="openModalDeleteItem()">❌Удалить</button>
    <modal @hideWindow="hideWindow" @modalConfirm="modalConfirm" :show="show" title="Удалить" />
  </div>
</template>

<script>
import Modal from "./modal/Modal";
import modal from "../mixins/modal";
import { mapActions } from "vuex";

export default {
  name: "NoteItem",
  mixins: [modal],
  components: {
    Modal
  },
  props: {
    note: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    ...mapActions(["DELETE_ITEM"]),
    openModalDeleteItem() {
      this.showWindow();
    },
    modalConfirm() {
      this.DELETE_ITEM(this.note.id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.note-item {
  border: 1px solid $main-color;
  padding: 15px;
  margin: 15px;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: 100%;

  &__link {
  }

  &__title {
  }
}
</style>
