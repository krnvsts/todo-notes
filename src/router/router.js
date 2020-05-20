import Vue from 'vue'
import Router from 'vue-router'

// components
import TodoList from "../components/TodoList";
import EditItem from "../components/EditItem";

Vue.use(Router)

let router = new Router({
	mode: 'history',
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
			name: 'TodoList',
			component: TodoList
		},
		{
			path: '/edit/:notesId',
			name: 'EditItem',
			component: EditItem
		},
		{
			path: '/add',
			name: 'AddNotes',
			component: EditItem
		}
	]
})

export default router
