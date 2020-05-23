<template>
  <div class="note-action">
    <input
      placeholder="Введи заголовок"
      class="note-action__title"
      type="text"
      :value="note.title"
      @input="note.title = $event.target.value"
    />
    <transition-group name="list" tag="ul">
      <li class="note-action__todo" v-for="(todo, index) in note.todo" :key="index">
        <label class="note-action__checkbox-label">
          <input
            class="note-action__checkbox"
            type="checkbox"
            @click="pushStateToHistory"
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
      @click="isEditable ? saveChangesNotes() : addNewNote()"
    >{{ isEditable ? '💾 Сохранить' : '💾 Добавить заметку' }}</button>
    <button v-if="!isSameNote && isEditable" @click="showModal('editing')">↪️Отменить редактирование</button>
    <button>⬅️Отменить действие</button>
    <button>➡️Повторить действие</button>
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
    addTodo: ""
  }),
  mixins: [modal],
  components: {
    Modal
  },
  created() {
    this.setNote();
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
    setNote() {
      if (this.$route.params.notesId) {
        this.isEditable = true;
        this.getDataForId(this.$route.params.notesId);
      } else {
        this.$set(this.note, "title", "");
        this.$set(this.note, "todo", []);
      }
      this.pushStateToHistory();
    },
    pushStateToHistory() {
      console.log("PUSH");
      // Сохраняем историю
      let conditionСopy = JSON.parse(JSON.stringify(this.note));
      this.history.push(conditionСopy);
    },
    getDataForId(noteId) {
      // Достаем из стора массив обьектов, находим нужный, записываем в data
      let data = this.NOTES.filter(elem => {
        if (elem.id == noteId) return elem;
      });
      this.note = data[0];
    },
    editTodo(index) {
      // Редактирования тудушки
      let oldValue = JSON.stringify(
        this.history[this.history.length - 1].todo[index] &&
          this.history[this.history.length - 1].todo[index][1]
      );
      let currentVlue = JSON.stringify(this.note.todo[index][1]);
      console.log("oldValue" + oldValue);
      console.log("currentVlue" + currentVlue);

      if (oldValue !== currentVlue) {
        this.pushStateToHistory();
        console.log("Разные значения");
      } else {
        console.log("Одинаковые значения");
      }
    },
    deleteTodo(index) {
      this.pushStateToHistory();
      this.note.todo.splice(index, 1);
    },
    addNewTodo() {
      // Добавление новой тудушки
      this.pushStateToHistory();
      this.note.todo.push([false, this.addTodo]);
      this.addTodo = "";
      this.$refs.todoInput.focus();
    },
    saveChangesNotes() {
      // Сохраняем по кнопке (Отправляем новый обьект в мутацию)
      // Отправляем новый обьект в мутацию
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
    // ADD NEW NOTE
    // -------------------
    addNewNote() {
      this.ADD_ITEM(this.note);
      this.isEditable = true;
      this.$router.push({ name: "NoteList" });
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
    // DELETE ITEM
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
