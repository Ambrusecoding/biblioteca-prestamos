import { useState } from 'react';
import { apiService } from '../../../services/api';
import { Input } from '../../molecules/Input/Input';
import { Button } from '../../atoms/Button/Button';
import './FormCrearLibro.css';

interface FormCrearLibroProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const FormCrearLibro = ({ onSubmit, onCancel }: FormCrearLibroProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    isbn: '',
    nombre: '',
  });

  const [formErrors, setFormErrors] = useState({
    isbn: '',
    nombre: '',
  });

  const validateForm = () => {
    const errors = {
      isbn: '',
      nombre: '',
    };

    if (!formData.isbn.trim()) {
      errors.isbn = 'El ISBN es requerido';
    }

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre del libro es requerido';
    }

    setFormErrors(errors);
    return !errors.isbn && !errors.nombre;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await apiService.createLibro({
        isbn: formData.isbn.trim(),
        nombre: formData.nombre.trim(),
      });
      onSubmit();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear el libro';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-crear-libro" onSubmit={handleSubmit}>
      {error && (
        <div className="form-crear-libro-error">
          <p>{error}</p>
        </div>
      )}

      <Input
        label="ISBN"
        type="text"
        value={formData.isbn}
        onChange={(value) => {
          setFormData({ ...formData, isbn: value });
          setFormErrors({ ...formErrors, isbn: '' });
        }}
        required
        error={formErrors.isbn}
        disabled={submitting}
        placeholder="Ej: 978-0-123456-78-9"
      />

      <Input
        label="Nombre del Libro"
        type="text"
        value={formData.nombre}
        onChange={(value) => {
          setFormData({ ...formData, nombre: value });
          setFormErrors({ ...formErrors, nombre: '' });
        }}
        required
        error={formErrors.nombre}
        disabled={submitting}
        placeholder="Ej: El Quijote de la Mancha"
      />

      <div className="form-crear-libro-actions">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear Libro'}
        </Button>
      </div>
    </form>
  );
};

