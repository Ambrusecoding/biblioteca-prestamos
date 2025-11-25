import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/atoms/Card/Card';
import { Title } from '../../components/atoms/Title/Title';
import { Button } from '../../components/atoms/Button/Button';
import './HomePage.css';

export const HomePage = () => {
  const navigate = useNavigate();

  const sections = [
    { path: '/usuarios', title: 'Usuarios', description: 'Gestiona los usuarios de la biblioteca' },
    { path: '/libros', title: 'Libros', description: 'Consulta el catálogo de libros disponibles' },
    { path: '/prestamos', title: 'Préstamos', description: 'Visualiza todos los préstamos activos' },
  ];

  return (
    <div className="home-page">
      <div className="home-hero">
        <Title level={1}>Bienvenido al Dashboard de la Biblioteca</Title>
        <p className="home-subtitle">
          Gestiona usuarios, libros y préstamos desde un solo lugar
        </p>
      </div>
      <div className="home-sections">
        {sections.map((section) => (
          <Card key={section.path} className="home-section-card">
            <Title level={3}>{section.title}</Title>
            <p>{section.description}</p>
            <Button onClick={() => navigate(section.path)}>Ir a {section.title}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

