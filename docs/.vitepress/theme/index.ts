import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import ChapterCatalog from './components/ChapterCatalog.vue'
import HomePage from './components/HomePage.vue'
import PrincipleDiagram from './components/PrincipleDiagram.vue'
import StudyProgress from './components/StudyProgress.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('ChapterCatalog', ChapterCatalog)
    app.component('PrincipleDiagram', PrincipleDiagram)
    app.component('StudyProgress', StudyProgress)
  }
} satisfies Theme
