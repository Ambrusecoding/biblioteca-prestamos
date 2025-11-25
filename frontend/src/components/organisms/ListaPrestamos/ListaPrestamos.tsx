import { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import type { Prestamo } from '../../../types';
import { Card } from '../../atoms/Card/Card';
import { Table } from '../../molecules/Table/Table';
import { SectionHeader } from '../../molecules/SectionHeader/SectionHeader';
import { Loading } from '../../atoms/Loading/Loading';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { Modal } from '../../molecules/Modal/Modal';
import { FormCrearPrestamo } from '../FormCrearPrestamo/FormCrearPrestamo';
import './ListaPrestamos.css';

export const ListaPrestamos = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPrestamos();
        setPrestamos(data);
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar préstamos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  const handleRefresh = () => {
    const fetchPrestamos = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPrestamos();
        setPrestamos(data);
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar préstamos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchPrestamos();
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    handleRefresh();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTipoUsuarioLabel = (tipo?: number) => {
    if (!tipo) return '-';
    switch (tipo) {
      case 1:
        return 'Afiliado';
      case 2:
        return 'Empleado';
      case 3:
        return 'Invitado';
      default:
        return 'Desconocido';
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (prestamo: Prestamo) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {prestamo.id.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'nombreLibro',
      label: 'Libro',
      render: (prestamo: Prestamo) => prestamo.nombreLibro || '-',
    },
    {
      key: 'isbn',
      label: 'ISBN',
    },
    {
      key: 'identificacionUsuario',
      label: 'Usuario',
    },
    {
      key: 'tipoUsuario',
      label: 'Tipo Usuario',
      render: (prestamo: Prestamo) => {
        if (!prestamo.tipoUsuario) return '-';
        const variant =
          prestamo.tipoUsuario === 1
            ? 'success'
            : prestamo.tipoUsuario === 2
            ? 'info'
            : 'warning';
        return (
          <Badge variant={variant}>{getTipoUsuarioLabel(prestamo.tipoUsuario)}</Badge>
        );
      },
    },
    {
      key: 'fechaPrestamo',
      label: 'Fecha Préstamo',
      render: (prestamo: Prestamo) => formatDate(prestamo.fechaPrestamo),
    },
    {
      key: 'fechaMaximaDevolucion',
      label: 'Fecha Máxima Devolución',
      render: (prestamo: Prestamo) => formatDate(prestamo.fechaMaximaDevolucion),
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
    <>
      <Card>
        <SectionHeader
          title="Préstamos"
          subtitle={`Total: ${prestamos.length} préstamos registrados`}
        />
        <div className="lista-prestamos-table-container">
          <Table
            data={prestamos}
            columns={columns}
            emptyMessage="No hay préstamos registrados"
          />
          <div className="lista-prestamos-actions">
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              + Crear Préstamo
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Préstamo"
      >
        <FormCrearPrestamo
          onSubmit={handleCreateSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

