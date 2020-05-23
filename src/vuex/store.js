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
			let isExistLSKey = localStorage.getItem("notes");
			let data;

			if (isExistLSKey) {
				data = JSON.parse(isExistLSKey);
				for (let i = 0; i < data.length; i++) {
					state.notes.push(data[i])
				}
			} else {
				data = [{
					id: 500023,
					title: "Ближайшие планы",
					todo: [
						[true, "Выполнить тестовое задание"],
						[false, "Пройти собеседование"],
						[false, "Разрабатывать крутые сайты с TR LogicLLC"]
					]
				}];
				state.notes.push(data[0])
				localStorage.setItem('notes', JSON.stringify(data));
			}
		},
		SET_ITEM: (state, note) => {
			// Добавить новую заметку
			let noteObj = note
			let rand = Math.floor(100000 + Math.random() * 900000)
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
		},
		UPDATE_STORE: (state) => {
			let localStorageArray = localStorage.getItem("notes");
			let currentLS = JSON.parse(localStorageArray)
			state.notes = currentLS
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
		},
		UPDATE_STORE({ commit }) {
			commit('UPDATE_STORE')
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
