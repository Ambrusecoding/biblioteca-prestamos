import { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import type { Usuario } from '../../../types';
import { Card } from '../../atoms/Card/Card';
import { Table } from '../../molecules/Table/Table';
import { SectionHeader } from '../../molecules/SectionHeader/SectionHeader';
import { Loading } from '../../atoms/Loading/Loading';
import { Badge } from '../../atoms/Badge/Badge';

export const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUsuarios();
        setUsuarios(data);
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar usuarios';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const getTipoUsuarioLabel = (tipo: number) => {
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

  const getTipoUsuarioVariant = (tipo: number): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (tipo) {
      case 1:
        return 'success';
      case 2:
        return 'info';
      case 3:
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      key: 'identificacionUsuario',
      label: 'Identificación',
    },
    {
      key: 'tipoUsuario',
      label: 'Tipo de Usuario',
      render: (usuario: Usuario) => (
        <Badge variant={getTipoUsuarioVariant(usuario.tipoUsuario)}>
          {getTipoUsuarioLabel(usuario.tipoUsuario)}
        </Badge>
      ),
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
        title="Usuarios"
        subtitle={`Total: ${usuarios.length} usuarios registrados`}
      />
      <Table data={usuarios} columns={columns} emptyMessage="No hay usuarios registrados" />
    </Card>
  );
};

