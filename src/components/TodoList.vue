<template>
  <div class="todo-list">
    <todo-item v-for="note in NOTES" :key="note.id" :note="note" />
    <router-link class="todo-list" :to="{name: 'AddNotes'}">Создать +</router-link>
  </div>
</template>

<script>
import TodoItem from "./TodoItem";
import { mapGetters } from "vuex";

export default {
  name: "TodoList",
  components: {
    TodoItem
  },
  computed: {
    ...mapGetters(["NOTES"])
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.todo-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &__button {
    border: 2px solid $main-color;
  }
}
</style>
