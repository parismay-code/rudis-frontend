import ReactDOM from 'react-dom/client';
import '~shared/main.scss';
import { Provider } from './providers';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider />,
);