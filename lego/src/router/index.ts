import { createRouter, createWebHistory } from 'vue-router'
import Home from '../view/Home.vue'
import Editor from '../view/Editor.vue'
import TemplateDetail from '../view/TemplateDetail.vue'
import Index from '../view/Index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        { path: '', name: 'home', component: Home },
        { path: 'template/:id', name: 'template', component: TemplateDetail }
      ]
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    }
  ]
})

export default router
