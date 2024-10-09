import cn from 'classnames';
import { Spinner } from '~shared/ui/spinner';
import './styles.scss';

type LoaderProps = {
  size?: 'small' | 'medium' | 'large' | 'full';
};

export function Loader({ size = 'medium' }: LoaderProps) {
  return (
    <div className={cn('wrapper', `loader-${size}`)}>
      <Spinner />
    </div>
  );
}