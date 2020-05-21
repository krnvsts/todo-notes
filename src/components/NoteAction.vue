<template>
  <div class="note-action">
    <input
      placeholder="Введи название заметки"
      class="note-action__title"
      type="text"
      :value="note.title"
      @input="note.title = $event.target.value"
    />
    <div class="note-action__todo" v-for="(todo, index) in note.todo" :key="index">
      <label class="container">
        <input type="checkbox" v-model="note.todo[index][0]" :checked="todo[0]" />
        <span class="checkmark"></span>
      </label>
      <input type="text" v-model="note.todo[index][1]" @blur="editTodo(index)" />
      <button @click="deleteTodo(index)">❌</button>
    </div>
    <div class="note-action__todo">
      <input
        type="text"
        placeholder="Поставь себе задачу"
        v-model="addTodo"
        @keyup.enter="addNewTodo"
        ref="todoInput"
      />
      <button @click="addNewTodo">➕</button>
    </div>
    <button v-if="isEditable" @click="openModalDeleteNote()">❌Удалить заметку</button>
    <button
      @click="isEditable ? saveChange() : addNewItem()"
    >{{ isEditable ? '💾 Сохранить' : '💾 Добавить заметку' }}</button>
    <modal @hideWindow="hideWindow" @modalConfirm="modalConfirm" :show="show" title="Удалить" />
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
    addTodo: "",
    addCheck: ""
  }),
  mixins: [modal],
  components: {
    Modal
  },
  created() {
    this.getNoteId();
  },
  computed: {
    ...mapGetters(["NOTES"])
  },
  methods: {
    ...mapActions(["ADD_ITEM", "CHANGE_ITEM", "DELETE_ITEM"]),
    getNoteId() {
      if (this.$route.params.notesId) {
        this.isEditable = true;
        this.getDataForId(this.$route.params.notesId);
      } else {
        this.$set(this.note, "title", "");
        this.$set(this.note, "todo", []);
      }
    },
    getDataForId(noteId) {
      // Достаем из стора массив обьектов, находим нужный, записываем в data
      let data = this.NOTES.filter(elem => {
        if (elem.id == noteId) return elem;
      });
      this.note = data[0];
    },
    editTodo(index) {
      // Редактирования айиема
      console.log(index);
    },
    deleteTodo(index) {
      console.log(index);
      this.note.todo.splice(index, 1);
      console.log(this.note);
    },
    addNewTodo() {
      // Добавление нового айтема
      // TODO переделать - получать обьект и сетить один обьект и не хранить 2 поля в data
      this.note.todo.push([false, this.addTodo]);
      this.addTodo = "";
      this.$refs.todoInput.focus();
      // this.changeItem(); // Раскоменитить если нужно горячее сохранение
    },
    saveChange() {
      // Сохраняем по кнопке
      this.changeItem();
    },
    changeItem() {
      // Отправляем новый обьект в мутацию
      console.log(this.note);
      this.CHANGE_ITEM(this.note);
    },
    // -------------------
    // ADD NEW ITEM
    // -------------------
    addNewItem() {
      this.ADD_ITEM(this.note);
      this.isEditable = true;
      // this.$router.push({ name: "NoteList" });
    },
    // -------------------
    // DELETE ITEM
    // -------------------
    openModalDeleteNote() {
      this.showWindow();
    },
    modalConfirm() {
      this.DELETE_ITEM(this.note.id);
      this.$router.push({ name: "NoteList" });
    }
    // -------------------
    // BEFORE LEAVE
    // -------------------
  },
  beforeRouteLeave(to, from, next) {
    next();
    console.log("Выход из роута");
  }
};
</script>

<style lang="scss" scoped>
.note-action {
  margin: 40px auto;
  width: 200px;
  font-size: 20px;

  &__title {
    font-size: 24px;
    border: none;
    padding: 10px;
  }

  &__todo {
    display: flex;
    flex-direction: row;
    margin: 9px 0;
  }
}

.container {
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

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  &:hover input ~ .checkmark {
    background-color: #ccc;
  }

  & input:checked ~ .checkmark {
    background-color: #2196f3;
  }

  & input:checked ~ .checkmark:after {
    display: block;
  }

  & .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
}

.checkmark {
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
</style>
