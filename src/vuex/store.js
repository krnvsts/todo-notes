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

			let localStorageArray = localStorage.getItem("notes");
			let data = JSON.parse(localStorageArray)
			data.push(noteObj)
			localStorage.setItem('notes', JSON.stringify(data));
		},
		DELETE_ITEM: (state, id) => {
			// Удалить новую заметку
			state.notes.map((item, index) => {
				if (item.id === id) {
					state.notes.splice(index, 1);
					let localStorageArray = localStorage.getItem("notes");
					let data = JSON.parse(localStorageArray)
					data.splice(index, 1);
					localStorage.setItem('notes', JSON.stringify(data));
				}
			})
		}
	},
	actions: {
		// Запускаем мутации (асинхронно)
		ADD_DEFAULT({ commit }) {
			commit('SET_NOTES')
		},
		ADD_ITEM({ commit }, note) {
			commit('SET_ITEM', note)
		},
		DELETE_ITEM({ commit }, id) {
			commit('DELETE_ITEM', id)
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
