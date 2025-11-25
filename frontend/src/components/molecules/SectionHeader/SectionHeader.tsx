import './SectionHeader.css';
import { Title } from '../../atoms/Title/Title';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const SectionHeader = ({
  title,
  subtitle,
  actions,
}: SectionHeaderProps) => {
  return (
    <div className="section-header">
      <div>
        <Title level={2}>{title}</Title>
        {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="section-header-actions">{actions}</div>}
    </div>
  );
};

