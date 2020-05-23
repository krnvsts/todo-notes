<template>
  <div class="note-list">
    <p v-if="NOTES.length < 1">Ой, похоже тут пусто. Создай новую заметку</p>
    <note-item v-for="note in NOTES" :key="note.id" :note="note" />
    <router-link class="note-list__button" :to="{name: 'AddNotes'}">Создать +</router-link>
  </div>
</template>

<script>
import NoteItem from "./NoteItem";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NoteList",
  components: {
    NoteItem
  },
  computed: {
    ...mapGetters(["NOTES"])
  },
  methods: {
    ...mapActions(["UPDATE_STORE"])
  },
  beforeMount() {
    this.UPDATE_STORE();
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.note-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &__button {
    border: 2px solid $main-color;
    padding: 10px;
  }
}
</style>
