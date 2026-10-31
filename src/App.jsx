import { useEffect, useState } from 'react';
import { DataProvider, useData } from './store.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Overview from './pages/Overview.jsx';
import Craftsmen from './pages/Craftsmen.jsx';
import Users from './pages/Users.jsx';
import Requests from './pages/Requests.jsx';

const PAGES = {
  overview: { title: 'Overview', C: Overview },
  craftsmen: { title: 'Craftsmen', C: Craftsmen },
  users: { title: 'Users', C: Users },
  requests: { title: 'Service requests', C: Requests },
};

function useRoute() {
  const read = () => {
    const k = location.hash.replace('#/', '').split('?')[0];
    return PAGES[k] ? k : 'overview';
  };
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

function Shell() {
  const route = useRoute();
  const { pendingCount, reload } = useData();
  const [menuOpen, setMenuOpen] = useState(false);
  const { title, C } = PAGES[route];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      <Sidebar route={route} pending={pendingCount} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <Topbar title={title} onMenu={() => setMenuOpen(true)} onRefresh={reload} />
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-3.5 py-6 lg:px-7"><C /></main>
        <footer className="mx-auto flex w-full max-w-[1280px] justify-between px-3.5 pb-5 text-xs text-muted lg:px-7">
          <span>© 2026 Hirafawy</span><span>Demo admin interface</span>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Shell />
    </DataProvider>
  );
}
