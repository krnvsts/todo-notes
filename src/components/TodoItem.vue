<template>
  <div class="todo-item">
    <router-link
      class="todo-item__link"
      :to="{
			name: 'EditItem',
			params: { notesId: note.id }
		}"
    >
      <div class="todo-item__title">{{ note.title }}</div>
      <div>{{ note.id }}</div>
      <div class="todo-item__content">
        <ul>
          <li v-for="(todo, index) in note.todo" :key="index">
            <span>{{ todo[0] }}</span>
            <span>{{ todo[1] }}</span>
          </li>
        </ul>
      </div>
    </router-link>
    <button @click="deleteItem(note.id)">Удалить</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "TodoItem",
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
    deleteItem(id) {
      this.DELETE_ITEM(id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.todo-item {
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
