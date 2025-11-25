import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import type { Usuario, Libro } from '../../../types';
import { Input } from '../../molecules/Input/Input';
import { Button } from '../../atoms/Button/Button';
import './FormCrearPrestamo.css';

interface FormCrearPrestamoProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const FormCrearPrestamo = ({ onSubmit, onCancel }: FormCrearPrestamoProps) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    identificacionUsuario: '',
    isbn: '',
  });

  const [formErrors, setFormErrors] = useState({
    identificacionUsuario: '',
    isbn: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usuariosData, librosData] = await Promise.all([
          apiService.getUsuarios(),
          apiService.getLibros(),
        ]);
        setUsuarios(usuariosData);
        setLibros(librosData);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar datos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const validateForm = () => {
    const errors = {
      identificacionUsuario: '',
      isbn: '',
    };

    if (!formData.identificacionUsuario.trim()) {
      errors.identificacionUsuario = 'Debe seleccionar un usuario';
    }

    if (!formData.isbn.trim()) {
      errors.isbn = 'Debe seleccionar un libro';
    }

    setFormErrors(errors);
    return !errors.identificacionUsuario && !errors.isbn;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await apiService.createPrestamo({
        identificacionUsuario: formData.identificacionUsuario,
        isbn: formData.isbn,
      });
      onSubmit();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear el préstamo';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const usuarioOptions = usuarios.map((usuario) => ({
    value: usuario.identificacionUsuario,
    label: `${usuario.identificacionUsuario} - ${getTipoUsuarioLabel(usuario.tipoUsuario)}`,
  }));

  const libroOptions = libros.map((libro) => ({
    value: libro.isbn,
    label: `${libro.isbn} - ${libro.nombre}`,
  }));

  if (loading) {
    return (
      <div className="form-crear-prestamo-loading">
        <p>Cargando usuarios y libros...</p>
      </div>
    );
  }

  return (
    <form className="form-crear-prestamo" onSubmit={handleSubmit}>
      {error && (
        <div className="form-crear-prestamo-error">
          <p>{error}</p>
        </div>
      )}

      <Input
        label="Usuario"
        type="select"
        value={formData.identificacionUsuario}
        onChange={(value) => {
          setFormData({ ...formData, identificacionUsuario: value });
          setFormErrors({ ...formErrors, identificacionUsuario: '' });
        }}
        options={usuarioOptions}
        required
        error={formErrors.identificacionUsuario}
        disabled={submitting}
      />

      <Input
        label="Libro"
        type="select"
        value={formData.isbn}
        onChange={(value) => {
          setFormData({ ...formData, isbn: value });
          setFormErrors({ ...formErrors, isbn: '' });
        }}
        options={libroOptions}
        required
        error={formErrors.isbn}
        disabled={submitting}
      />

      <div className="form-crear-prestamo-actions">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear Préstamo'}
        </Button>
      </div>
    </form>
  );
};

