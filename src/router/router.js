import Vue from 'vue'
import Router from 'vue-router'

// components
import NoteList from "../components/NoteList";
import NoteAction from "../components/NoteAction";

Vue.use(Router)

let router = new Router({
	// mode: 'history',
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	},
	routes: [
		{
			path: '/',
			name: 'NoteList',
			component: NoteList
		},
		{
			path: '/edit/:notesId',
			name: 'NoteAction',
			component: NoteAction
		},
		{
			path: '/add',
			name: 'AddNotes',
			component: NoteAction
		}
	]
})

export default router
