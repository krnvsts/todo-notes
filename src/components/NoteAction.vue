<template>
  <div class="note-action">
    <input
      :style="{ color: `#${note.id}bb`}"
      placeholder="Введи заголовок"
      class="note-action__title"
      type="text"
      :value="note.title"
      @input="note.title = $event.target.value"
      @focus="startEditTitle()"
      @blur="editTitle()"
      maxlength="50"
    />
    <transition-group name="list" tag="ul">
      <li class="note-action__todo" v-for="(todo, index) in note.todo" :key="index">
        <label class="note-action__checkbox-label">
          <input
            class="note-action__checkbox"
            type="checkbox"
            @click="saveStateToHistory()"
            v-model="note.todo[index][0]"
            :checked="todo[0]"
          />
          <span class="note-action__checkmark"></span>
        </label>
        <input
          class="note-action__todo-name"
          :class="{'note-action__todo-name--checked': todo[0]}"
          type="text"
          v-model="note.todo[index][1]"
          maxlength="50"
          @focus="startEditTodo()"
          @blur="editTodo(index)"
        />
        <button
          class="note-action__todo-delete note-action__button note-action__button--delete"
          @click="deleteTodo(index)"
        >
          <icon-base>
            <icon-clear />
          </icon-base>
        </button>
      </li>
    </transition-group>
    <section class="note-action__add-section">
      <button class="note-action__add-button" @click="addNewTodo">
        <icon-base class="note-action__add-icon">
          <icon-add-circle />
        </icon-base>
      </button>
      <input
        class="note-action__add-input"
        type="text"
        placeholder="Новый пункт"
        v-model="addTodo"
        @keyup.enter="addNewTodo"
        ref="todoInput"
      />
    </section>
    <p class="note-action__warning">{{ warning }}</p>
    <footer class="note-action__footer">
      <button
        class="note-action__button note-action__button--save"
        @click="isEditable ? saveChangesNote() : addNewNote()"
      >
        <icon-base>
          <icon-save />
        </icon-base>
        {{ isEditable ? 'Сохранить' : 'Добавить заметку' }}
      </button>
      <div class="note-action__history-buttons">
        <button v-if="history.length > 1" @click="undoChanges">
          <icon-base>
            <icon-undo />
          </icon-base>
        </button>
        <button v-if="historyArchive.length > 1" @click="redoChanges">
          <icon-base>
            <icon-redo />
          </icon-base>
        </button>
      </div>
      <button
        class="note-action__button note-action__button--discard"
        v-if="isEditable && history.length > 1"
        @click="showModal('editing')"
      >
        <icon-base>
          <icon-discard />
        </icon-base>
      </button>
      <button
        class="note-action__button note-action__button--delete"
        v-if="isEditable"
        @click="showModal('delete')"
      >
        <icon-base>
          <icon-delete-bin />
        </icon-base>
      </button>
    </footer>
    <modal
      v-if="isShowModal"
      :typeModal="typeModal"
      @hideWindow="hideWindow"
      @modalConfirm="modalConfirm"
    />
  </div>
</template>

<script>
import Modal from "./modal/Modal";
import modal from "../mixins/modal";

// vuex
import { mapGetters, mapActions } from "vuex";

// icons
import IconBase from "./icons/IconBase.vue";
import IconAddCircle from "./icons/IconAddCircle.vue";
import IconClear from "./icons/IconClear.vue";
import IconDeleteBin from "./icons/IconDeleteBin.vue";
import IconSave from "./icons/IconSave.vue";
import IconUndo from "./icons/IconUndo.vue";
import IconRedo from "./icons/IconRedo.vue";
import IconDiscard from "./icons/IconDiscard.vue";

export default {
  name: "NoteAction",
  data: () => ({
    isEditable: false,
    note: {},
    history: [],
    historyArchive: [],
    addTodo: "",
    warning: ""
  }),
  mixins: [modal],
  components: {
    Modal,
    IconBase,
    IconAddCircle,
    IconClear,
    IconDeleteBin,
    IconSave,
    IconUndo,
    IconRedo,
    IconDiscard
  },
  created() {
    this.setNoteData();
    document.addEventListener("keydown", this.keyPress);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keyPress);
  },
  computed: {
    ...mapGetters(["NOTES"])
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
      this.historyArchive = [];
    },
    // -------------------
    // TODO
    // -------------------
    addNewTodo() {
      // Добавление тудушки
      if (this.addTodo.length > 0) {
        this.saveStateToHistory();
        this.note.todo.push([false, this.addTodo]);
        this.addTodo = "";
        this.warning = "";
        this.$refs.todoInput.focus();
      } else {
        this.warning = "Название пункта не должно быть пустое";
      }
    },
    deleteTodo(index) {
      // Удаление тудушки
      this.saveStateToHistory();
      this.note.todo.splice(index, 1);
    },
    startEditTitle() {
      this.saveStateToHistory();
    },
    editTitle() {
      // Редактирования Тайтла
      let oldValueTitle = JSON.stringify(
        this.history[this.history.length - 2].title
      );
      let currentValueTodo = JSON.stringify(this.note.title);

      console.log(oldValueTitle);
      console.log(currentValueTodo);

      if (oldValueTitle !== currentValueTodo) {
        console.log("Разные значения Тайтла");
      } else {
        this.history.pop();
        console.log("Одинаковые значения Тайтла");
      }
    },
    startEditTodo() {
      this.saveStateToHistory();
    },
    editTodo(index) {
      // Проверка на введенное значение при редактировании тудушки
      let oldValueTodo = JSON.stringify(
        this.history[this.history.length - 2].todo[index] &&
          this.history[this.history.length - 2].todo[index][1]
      );
      let currentValueTodo = JSON.stringify(this.note.todo[index][1]);

      if (oldValueTodo !== currentValueTodo) {
        console.log("Разные значения");
      } else {
        this.history.pop();
        console.log("Одинаковые значения - удаляем последний (при фокусе)");
      }
    },
    // -------------------
    // NOTE ACTION
    // -------------------
    saveChangesNote() {
      // Сохранить изменения редактирования
      if (this.note.title.length > 0) {
        this.CHANGE_ITEM(this.note);
        this.$router.push({ name: "NoteList" });
      } else {
        this.warning = "Название заметки не должно быть пустое";
      }
    },
    discardEditing() {
      // Отменить редактирование
      let initialValue = JSON.parse(JSON.stringify(this.history[0]));
      this.note = initialValue;
      this.history = [initialValue];
      this.historyArchive = [];
    },
    // -------------------
    // UNDO / REDO
    // -------------------
    keyPress(e) {
      if (e.keyCode == 90 && e.ctrlKey) {
        e.preventDefault();
        this.undoChanges();
      }
      if (e.keyCode == 89 && e.ctrlKey) {
        e.preventDefault();
        this.redoChanges();
      }
      if (e.keyCode == 83 && e.ctrlKey) {
        e.preventDefault();
        if (this.isEditable) {
          this.saveChangesNote();
        } else {
          this.addNewNote();
        }
      }
    },
    undoChanges() {
      // Отменить действие
      if (this.historyArchive.length === 0) {
        this.historyArchive.push(this.note);
      }
      if (this.history.length > 1) {
        let lastUpdate = JSON.parse(
          JSON.stringify(this.history[this.history.length - 1])
        );
        this.note = lastUpdate;
        this.historyArchive.push(lastUpdate);
        this.history.pop();
      }
    },
    redoChanges() {
      // Повторить действие
      if (this.historyArchive.length > 1) {
        let previousHistoryValue = JSON.parse(
          JSON.stringify(this.historyArchive[this.historyArchive.length - 2])
        );
        let lastArchiveNote = JSON.parse(
          JSON.stringify(this.historyArchive[this.historyArchive.length - 1])
        );
        this.note = previousHistoryValue;
        this.history.push(lastArchiveNote);
        this.historyArchive.pop();
      }
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
      if (this.note.title.length > 0) {
        this.ADD_ITEM(this.note);
        this.isEditable = true;
        this.warning = "";
        this.$router.push({ name: "NoteList" });
      } else {
        this.warning = "Название заметки не должно быть пустое";
      }
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
@import "~@/styles/variables.scss";
@import "~@/styles/mixins.scss";

.note-action {
  display: flex;
  flex-direction: column;
  width: calc(100% - 30px);
  border: 1px solid $gray-color;
  border-radius: $brd;
  padding: 15px;
  margin: 15px auto;
  overflow: hidden;
  transition: $transition;

  &__title {
    font-size: 30px;
    font-weight: 600;
    border: none;
    padding: 10px 0;
  }

  &__todo {
    display: flex;
    flex-direction: row;

    &:hover {
      .note-action__todo-delete {
        opacity: 1;
      }
    }
  }

  &__checkbox-label {
    display: block;
    position: relative;
    margin: 6px 0 0 2px;
    padding: 0 0 0 35px;
    cursor: pointer;
    font-size: 22px;
    user-select: none;

    .note-action__checkbox {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    &:hover .note-action__checkbox ~ .note-action__checkmark {
      background-color: $gray-color;
    }

    & .note-action__checkbox:checked ~ .note-action__checkmark {
      background-color: $main-color;
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
    border-radius: 50%;
    background-color: $gray-color;

    &:after {
      content: "";
      position: absolute;
      display: none;
    }
  }

  &__todo-name {
    width: 100%;
    font-size: 16px;
    padding: 8px 0;
    border: none;

    &--checked {
      text-decoration: line-through;
    }
  }

  &__todo-delete {
    opacity: 0;
  }

  &__add-section {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
  }

  &__add-icon {
    width: 30px;
    height: 30px;
    margin-right: 7px;
  }

  &__add-input {
    width: 100%;
    border: none;
    font-size: 16px;
  }

  &__footer {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
  }

  &__history-buttons {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
  }

  &__button {
    color: $text-color;

    &--save:hover {
      color: $main-color;
    }

    &--discard:hover {
      color: $orange-color;
    }

    &--delete:hover {
      color: $red-color;
    }
  }

  &__warning {
    width: 100%;
    margin: 20px 0;
    font-size: 14px;
    text-transform: uppercase;
    color: $red-color;
  }

  @include sm-and-up {
    width: 400px;
  }
}

::placeholder {
  color: $placeholder-color;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.1s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
