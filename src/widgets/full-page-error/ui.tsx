import { GenericError } from '~shared/lib/fetch';
import { ErrorHandler } from '~shared/ui/error';
import './styles.scss';

type FullPageErrorProps = {
  error: GenericError<any>;
};

export function FullPageError({ error }: FullPageErrorProps) {
  return (
    <div className="outer-wrapper">
      <div className="inner-wrapper">
        <div className="container">
          <h1 className="logo-font">Something went wrong:</h1>
          <ErrorHandler error={error} size="small" />
        </div>
      </div>
    </div>
  );
}