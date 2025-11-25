import './Title.css';

interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const Title = ({ children, level = 1, className = '' }: TitleProps) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag className={`title title-${level} ${className}`}>
      {children}
    </HeadingTag>
  );
};

