<template>
  <div class="note-action">
    {{ historyCount }}
    <input
      placeholder="Введи заголовок"
      class="note-action__title"
      type="text"
      :value="note.title"
      @input="note.title = $event.target.value"
      @blur="editTitle"
    />
    <transition-group name="list" tag="ul">
      <li class="note-action__todo" v-for="(todo, index) in note.todo" :key="index">
        <label class="note-action__checkbox-label">
          <input
            class="note-action__checkbox"
            type="checkbox"
            @click="saveStateToHistory"
            v-model="note.todo[index][0]"
            :checked="todo[0]"
          />
          <span class="note-action__checkmark"></span>
        </label>
        <input type="text" v-model="note.todo[index][1]" @blur="editTodo(index)" />
        <button @click="deleteTodo(index)">❌</button>
      </li>
    </transition-group>
    <div class="note-action__add">
      <input
        type="text"
        placeholder="Новый пункт"
        v-model="addTodo"
        @keyup.enter="addNewTodo"
        ref="todoInput"
      />
      <button @click="addNewTodo">➕</button>
    </div>
    <button v-if="isEditable" @click="showModal('delete')">❌Удалить заметку</button>
    <button
      @click="isEditable ? saveChangesNote() : addNewNote()"
    >{{ isEditable ? '💾 Сохранить' : '💾 Добавить заметку' }}</button>
    <button v-if="!isSameNote && isEditable" @click="showModal('editing')">↪️Отменить редактирование</button>
    <button @click="undoChanges">⬅️Отменить действие</button>
    <button @click="redoChanges">➡️Повторить действие</button>
    <modal
      v-if="isShowModal"
      :typeModal="typeModal"
      @hideWindow="hideWindow"
      @modalConfirm="modalConfirm"
    />
    <br />
    {{ isSameNote }}
    <br />
    {{ history }}
  </div>
</template>

<script>
import Modal from "./modal/Modal";
import modal from "../mixins/modal";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NoteAction",
  data: () => ({
    isEditable: false,
    note: {},
    history: [],
    historyCount: -1,
    addTodo: ""
  }),
  mixins: [modal],
  components: {
    Modal
  },
  created() {
    this.setNoteData();
  },
  computed: {
    ...mapGetters(["NOTES"]),
    isSameNote() {
      return (
        JSON.stringify(this.note) ===
        JSON.stringify(this.history[this.history.length - 1])
      );
    }
  },
  methods: {
    ...mapActions(["ADD_ITEM", "CHANGE_ITEM", "DELETE_ITEM"]),
    setNoteData() {
      if (this.$route.params.notesId) {
        this.isEditable = true;
        let data = this.NOTES.filter(elem => {
          if (elem.id == this.$route.params.notesId) return elem;
        });
        this.note = data[0];
      } else {
        this.$set(this.note, "title", "");
        this.$set(this.note, "todo", []);
      }
      this.saveStateToHistory();
    },
    saveStateToHistory() {
      // Сохраняем историю изменений в history: []
      let conditionСopy = JSON.parse(JSON.stringify(this.note));
      this.history.push(conditionСopy);
      this.historyCount++;
    },
    // -------------------
    // TODO
    // -------------------
    addNewTodo() {
      // Добавление тудушки
      this.saveStateToHistory();
      this.note.todo.push([false, this.addTodo]);
      this.addTodo = "";
      this.$refs.todoInput.focus();
    },
    deleteTodo(index) {
      // Удаление тудушки
      this.saveStateToHistory();
      this.note.todo.splice(index, 1);
    },
    editTitle() {
      // Редактирования Тайтла
      let oldValueTitle = JSON.stringify(
        this.history[this.history.length - 1].title
      );
      let currentValueTodo = JSON.stringify(this.note.title);

      if (oldValueTitle !== currentValueTodo) {
        this.saveStateToHistory();
        console.log("Разные значения Тайтла");
      } else {
        console.log("Одинаковые значения Тайтла");
      }
    },
    editTodo(index) {
      // Редактирования тудушки
      let oldValueTodo = JSON.stringify(
        this.history[this.history.length - 1].todo[index] &&
          this.history[this.history.length - 1].todo[index][1]
      );
      let currentValueTodo = JSON.stringify(this.note.todo[index][1]);

      if (oldValueTodo !== currentValueTodo) {
        this.saveStateToHistory();
        console.log("Разные значения");
      } else {
        console.log("Одинаковые значения");
      }
    },
    // -------------------
    // NOTE ACTION
    // -------------------
    saveChangesNote() {
      // Сохранить изменения редактирования
      this.CHANGE_ITEM(this.note);
      this.$router.push({ name: "NoteList" });
    },
    discardEditing() {
      // Отменить редактирование
      let initialValue = JSON.parse(JSON.stringify(this.history[0]));
      this.note = initialValue;
      this.history = [initialValue];
    },
    // -------------------
    // UNDO / REDO
    // -------------------
    undoChanges() {
      // Отменить действие
      console.log("UNDO");
      // this.historyCount--;
      // let lastUpdate = JSON.parse(
      //   JSON.stringify(this.history[this.historyCount])
      // );
      // this.note = lastUpdate;
    },
    redoChanges() {
      // Повторить действие
      console.log("REDO");
      // this.historyCount++;
      // let lastUpdate = JSON.parse(
      //   JSON.stringify(this.history[this.historyCount])
      // );
      // this.note = lastUpdate;
    },
    // -------------------
    // MODAL CONFIRM
    // -------------------
    modalConfirm() {
      if (this.typeModal === "delete") {
        console.log(this.typeModal);
        this.deleteNote();
      } else if (this.typeModal === "editing") {
        this.discardEditing();
        console.log(this.typeModal);
      }
    },
    // -------------------
    // ADD NEW NOTE
    // -------------------
    addNewNote() {
      this.ADD_ITEM(this.note);
      this.isEditable = true;
      this.$router.push({ name: "NoteList" });
    },
    // -------------------
    // DELETE NOTE
    // -------------------
    deleteNote() {
      this.DELETE_ITEM(this.note.id);
      this.$router.push({ name: "NoteList" });
    }
  },
  // -------------------
  // BEFORE LEAVE
  // -------------------
  beforeRouteLeave(to, from, next) {
    next();
    console.log("Выход из роута");
  }
};
</script>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.note-action {
  margin: 40px auto;
  width: 200px;
  font-size: 20px;

  &__title {
    font-size: 24px;
    border: none;
    padding: 10px 0;
  }

  &__todo {
    display: flex;
    flex-direction: row;
    margin: 9px 0;
  }

  &__add {
    display: flex;
    justify-content: space-between;
  }

  &__checkbox-label {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .note-action__checkbox {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    &:hover .note-action__checkbox ~ .note-action__checkmark {
      background-color: #ccc;
    }

    & .note-action__checkbox:checked ~ .note-action__checkmark {
      background-color: #2196f3;
      &:after {
        display: block;
      }
    }

    & .note-action__checkmark:after {
      left: 9px;
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }
  }

  &__checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;

    &:after {
      content: "";
      position: absolute;
      display: none;
    }
  }
}
</style>
