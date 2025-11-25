import './Input.css';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options,
  disabled = false,
}: InputProps) => {
  return (
    <div className="input-group">
      <label className="input-label">
        {label}
        {required && <span className="input-required">*</span>}
      </label>
      {type === 'select' && options ? (
        <select
          className={`input-field ${error ? 'input-error' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
        >
          <option value="">Seleccione una opción</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={`input-field ${error ? 'input-error' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      )}
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

