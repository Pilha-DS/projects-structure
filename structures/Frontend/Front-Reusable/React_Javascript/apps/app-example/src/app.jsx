import { Route, Routes } from 'react-router-dom';

import { ExamplePage } from './features/example/presentation/example-page.jsx';

/**
 * Composição do app: rotas e layout.
 *
 * Cada feature registra a sua rota aqui (ou em `src/routing/`).
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<ExamplePage />} />
    </Routes>
  );
}
