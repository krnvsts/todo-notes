<template>
  <section class="note-item">
    <router-link
      class="note-item__link"
      :to="{
			name: 'NoteAction',
			params: { notesId: note.id }
		}"
    >
      <h2 :style="{ color: `#${note.id}bb`}" class="note-item__title">{{ note.title }}</h2>
      <ul class="note-item__list">
        <li v-for="(todo, index) in note.todo" :key="index">
          <input type="checkbox" value="1" :checked="todo[0]" @click.prevent />
          <span :class="{'note-item__list-item--checked': todo[0]}">{{ todo[1] }}</span>
        </li>
      </ul>
    </router-link>
    <button @click="showModal('delete')">❌Удалить</button>
    <modal
      v-if="isShowModal"
      :typeModal="typeModal"
      @hideWindow="hideWindow"
      @modalConfirm="modalConfirm"
    />
  </section>
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
    modalConfirm() {
      this.DELETE_ITEM(this.note.id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.note-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  border: 1px solid $main-color;
  padding: 15px;
  margin: 15px;

  &__link {
    text-decoration: none;
    color: $text-color;
  }

  &__title {
    font-size: 24px;
  }

  &__list {
    list-style: none;
  }

  &__list-item {
    &--checked {
      text-decoration: line-through;
    }
  }
}
</style>
