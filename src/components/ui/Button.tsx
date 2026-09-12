import { ReactNode } from 'react';

type Props = {
  href?: string;
  children: ReactNode;
  variant?: 'default' | 'primary' | 'coral';
  onClick?: () => void;
  type?: 'button' | 'submit';
};

export default function Button({ href, children, variant = 'default', onClick, type = 'button' }: Props) {
  const cls = `btn ${variant === 'primary' ? 'btn-primary' : ''} ${variant === 'coral' ? 'btn-coral' : ''}`;
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
