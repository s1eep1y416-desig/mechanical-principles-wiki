import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import ChapterHero from './components/ChapterHero.vue'
import ChapterCatalog from './components/ChapterCatalog.vue'
import TextbookToc from './components/TextbookToc.vue'
import StudyProgress from './components/StudyProgress.vue'
import FormulaQuickSearch from './components/FormulaQuickSearch.vue'
import UnitConvention from './components/UnitConvention.vue'
import MechFigure from './components/MechFigure.vue'
import EngineeringDiagram from './components/EngineeringDiagram.vue'
import LinkageLab from './components/LinkageLab.vue'
import LegacyRoute from './components/LegacyRoute.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('ChapterHero', ChapterHero)
    app.component('ChapterCatalog', ChapterCatalog)
    app.component('TextbookToc', TextbookToc)
    app.component('StudyProgress', StudyProgress)
    app.component('FormulaQuickSearch', FormulaQuickSearch)
    app.component('UnitConvention', UnitConvention)
    app.component('MechFigure', MechFigure)
    app.component('EngineeringDiagram', EngineeringDiagram)
    app.component('LinkageLab', LinkageLab)
    app.component('LegacyRoute', LegacyRoute)
  }
} satisfies Theme
