import { NavLink } from 'react-router-dom';
import './Navigation.css';

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/usuarios', label: 'Usuarios' },
  { path: '/libros', label: 'Libros' },
  { path: '/prestamos', label: 'Préstamos' },
];

export const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="navigation-brand">
        <h1>📚 Biblioteca Dashboard</h1>
      </div>
      <ul className="navigation-list">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `navigation-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

