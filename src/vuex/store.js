import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let store = new Vuex.Store({
	state: {
		// Глобальное хранилище
		notes: []
	},
	mutations: {
		// Мутируем (изменяем) наш state (синхронно)
		SET_NOTES: (state) => {
			// Если ничего нет в LS - сетим стандартную заметку
			// Если есть - сетим все что есть в цикле
			let isExistStorageArray = localStorage.getItem("notes");
			let data;

			if (isExistStorageArray) {
				data = JSON.parse(isExistStorageArray);
				for (let i = 0; i < data.length; i++) {
					state.notes.push(data[i])
				}
			} else {
				data = [{
					id: 5423,
					title: "Как пользоваться заметками?",
					todo: [
						[true, "Нажмите кнопку СОЗДАТЬ"],
						[true, "Создайте себе список"],
						[true, "Отмечайте, чтобы не забыть"]
					]
				}];
				state.notes.push(data)
				localStorage.setItem('notes', JSON.stringify(data));
			}
		},
		SET_ITEM: (state, note) => {
			// Добавить новую заметку
			let noteObj = note
			let rand = Math.floor(Math.random() * 10000)
			note.id = rand
			state.notes.push(noteObj)
		},
		CHANGE_ITEM: (state, note) => {
			let changededState = state.notes.map(elem => {
				if (elem.id == note.id) {
					elem = note;
					return elem;
				}
				return elem;
			})
			state.notes = changededState;
		},
		DELETE_ITEM: (state, id) => {
			// Удалить новую заметку
			state.notes.map((item, index) => {
				if (item.id === id) {
					state.notes.splice(index, 1);
				}
			})
		},
		CHANGE_LOCAL_STORE: (state) => {
			// Сетим данные в LS
			let localStorageArray = localStorage.getItem("notes");
			let currentLS = JSON.parse(localStorageArray)
			currentLS = state.notes
			localStorage.setItem('notes', JSON.stringify(currentLS));
		}
	},
	actions: {
		// Запускаем мутации (асинхронно)
		ADD_DEFAULT({ commit }) {
			commit('SET_NOTES')
		},
		ADD_ITEM({ commit }, note) {
			commit('SET_ITEM', note)
			commit('CHANGE_LOCAL_STORE')
		},
		CHANGE_ITEM({ commit }, note) {
			commit('CHANGE_ITEM', note)
			commit('CHANGE_LOCAL_STORE')
		},
		DELETE_ITEM({ commit }, id) {
			commit('DELETE_ITEM', id)
			commit('CHANGE_LOCAL_STORE')
		}
	},
	getters: {
		// Получаем значение из state в компонентах
		NOTES(state) {
			return state.notes
		}
	},
})

export default store
