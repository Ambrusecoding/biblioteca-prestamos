import { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import type { Libro } from '../../../types';
import { Card } from '../../atoms/Card/Card';
import { Table } from '../../molecules/Table/Table';
import { SectionHeader } from '../../molecules/SectionHeader/SectionHeader';
import { Loading } from '../../atoms/Loading/Loading';

export const ListaLibros = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLibros();
        setLibros(data);
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar libros';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  const columns = [
    {
      key: 'isbn',
      label: 'ISBN',
    },
    {
      key: 'nombre',
      label: 'Nombre del Libro',
    },
  ];

  if (loading) {
    return (
      <Card>
        <Loading />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
          <p>Error: {error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader
        title="Libros"
        subtitle={`Total: ${libros.length} libros disponibles`}
      />
      <Table data={libros} columns={columns} emptyMessage="No hay libros registrados" />
    </Card>
  );
};

