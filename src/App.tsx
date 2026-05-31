import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ChapterPage } from './pages/ChapterPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/chapter/:slug" element={<ChapterPage />} />
      </Route>
    </Routes>
  )
}
