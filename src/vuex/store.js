import Vue from 'vue'
import Vuex from 'vuex'
import defaultState from "../config/defaultState"

Vue.use(Vuex);

let store = new Vuex.Store({
	state: {
		notes: []
	},
	mutations: {
		SET_NOTES: (state) => {
			// Если заметок нет в LS - сетим дефолтные заметки
			// Иначе сетим все из LS
			let isExistLSKey = localStorage.getItem("notes");
			let data;

			if (isExistLSKey) {
				data = JSON.parse(isExistLSKey);
				for (let i = 0; i < data.length; i++) {
					state.notes.push(data[i])
				}
			} else {
				data = defaultState
				state.notes.push(data[0])
				localStorage.setItem('notes', JSON.stringify(data));
			}
		},
		SET_ITEM: (state, note) => {
			// Добавить новую заметку (+ генерация id)
			let noteObj = note
			note.id = Math.floor(100000 + Math.random() * 900000)
			state.notes.push(noteObj)
		},
		CHANGE_ITEM: (state, note) => {
			// Изменить заметку (находим в стейте и перезаписываем)
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
			// Засетить данные в LS
			let localStorageArray = localStorage.getItem("notes");
			let currentLS = JSON.parse(localStorageArray)
			currentLS = state.notes
			localStorage.setItem('notes', JSON.stringify(currentLS));
		},
		UPDATE_STORE: (state) => {
			// Вызвать обновление стейта
			let localStorageArray = localStorage.getItem("notes");
			let currentLS = JSON.parse(localStorageArray)
			state.notes = currentLS
		}
	},
	actions: {
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
		NOTES(state) {
			return state.notes
		}
	},
})

export default store
