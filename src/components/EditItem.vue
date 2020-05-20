<template>
  <div class="edit-item">
    <template v-if="note">
      {{ getNoteId() }}
      <input type="text" :value="note.title" />
      <div v-for="(todo, index) in note.todo" :key="index">
        <input type="checkbox" :checked="todo[0]" />
        <input type="text" :value="todo[1]" @blur="editTodo(index)" />
        <button @click="editTodo(index)">✓</button>
      </div>
      <div>
        <input type="checkbox" v-model="addCheck" />
        <input type="text" v-model="addTodo" />
        <button @click="addNewTodo">✓</button>
      </div>
    </template>
    <template v-else>
      <p>Страница создания</p>
      <button @click="addNewItem">Добавить запись</button>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditItem",
  data: () => ({
    isEditable: true,
    note: {},
    addTodo: "",
    addCheck: ""
  }),
  created() {
    this.getNoteId();
    this.getDataForId();
  },
  computed: {
    ...mapGetters(["NOTES"])
  },
  methods: {
    ...mapActions(["ADD_ITEM"]),
    getNoteId() {
      return this.$route.params.notesId;
    },
    getDataForId() {
      // Достаем из стора массив обьектов, находим нужный, записываем в data
      let data = this.NOTES.filter(elem => {
        if (elem.id == this.getNoteId()) return elem;
      });
      this.note = data[0];
      return data[0];
    },
    editTodo(index) {
      // Редактирования айиема
      console.log(index);
    },
    addNewTodo() {
      // Добавление нового айтема
      this.note.todo.push([this.addCheck, this.addTodo]);
      this.addCheck = "";
      this.addTodo = "";
      // console.log(this.addCheck);
      // console.log(this.addTodo);
      this.addNotesInLocalStorrage();
    },
    addNotesInLocalStorrage() {
      // Тут достаем массив из LS сетим изменения и заново его туда запихиваем с новыми значениями
      // Перенести эту логику в стор
      let isExistStorrageArray = localStorage.getItem("notes");
      let localStorr = JSON.parse(isExistStorrageArray);
      console.log(localStorr);
      let data = localStorr.map(elem => {
        if (elem.id == this.getNoteId()) {
          elem = this.note;
          return elem;
        }
        return elem;
      });
      console.log(data);
      data = JSON.stringify(data);
      localStorage.setItem("notes", data);
    },
    // -------------------
    // ADD
    // -------------------
    addNewItem() {
      let itemObj = {
        title: "Как пользоваться заметками?",
        todo: [
          [true, "Нажмите кнопку СОЗДАТЬ"],
          [true, "Создайте себе список"],
          [true, "Отмечайте, чтобы не забыть"]
        ]
      };
      this.ADD_ITEM(itemObj);
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-item {
  font-size: 20px;
}
</style>
