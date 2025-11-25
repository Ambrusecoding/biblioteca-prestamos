import { useState } from 'react';
import { apiService } from '../../../services/api';
import { Input } from '../../molecules/Input/Input';
import { Button } from '../../atoms/Button/Button';
import './FormCrearUsuario.css';

interface FormCrearUsuarioProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const FormCrearUsuario = ({ onSubmit, onCancel }: FormCrearUsuarioProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    identificacionUsuario: '',
    tipoUsuario: 1,
  });

  const [formErrors, setFormErrors] = useState({
    identificacionUsuario: '',
    tipoUsuario: '',
  });

  const tipoUsuarioOptions = [
    { value: '1', label: 'Afiliado' },
    { value: '2', label: 'Empleado' },
    { value: '3', label: 'Invitado' },
  ];

  const validateForm = () => {
    const errors = {
      identificacionUsuario: '',
      tipoUsuario: '',
    };

    if (!formData.identificacionUsuario.trim()) {
      errors.identificacionUsuario = 'La identificación es requerida';
    } else if (formData.identificacionUsuario.length > 10) {
      errors.identificacionUsuario = 'La identificación no puede tener más de 10 caracteres';
    }

    if (!formData.tipoUsuario || formData.tipoUsuario < 1 || formData.tipoUsuario > 3) {
      errors.tipoUsuario = 'Debe seleccionar un tipo de usuario válido';
    }

    setFormErrors(errors);
    return !errors.identificacionUsuario && !errors.tipoUsuario;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await apiService.createUsuario({
        identificacionUsuario: formData.identificacionUsuario.trim(),
        tipoUsuario: formData.tipoUsuario,
      });
      onSubmit();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear el usuario';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-crear-usuario" onSubmit={handleSubmit}>
      {error && (
        <div className="form-crear-usuario-error">
          <p>{error}</p>
        </div>
      )}

      <Input
        label="Identificación"
        type="text"
        value={formData.identificacionUsuario}
        onChange={(value) => {
          setFormData({ ...formData, identificacionUsuario: value });
          setFormErrors({ ...formErrors, identificacionUsuario: '' });
        }}
        required
        error={formErrors.identificacionUsuario}
        disabled={submitting}
        placeholder="Ej: 1234567890"
      />

      <Input
        label="Tipo de Usuario"
        type="select"
        value={formData.tipoUsuario.toString()}
        onChange={(value) => {
          setFormData({ ...formData, tipoUsuario: parseInt(value, 10) });
          setFormErrors({ ...formErrors, tipoUsuario: '' });
        }}
        options={tipoUsuarioOptions}
        required
        error={formErrors.tipoUsuario}
        disabled={submitting}
      />

      <div className="form-crear-usuario-actions">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
};

