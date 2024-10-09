import cn from 'classnames';
import { UnexpectedErrorDto } from '~shared/api';
import { GenericError, isHttpErrorCode } from '~shared/lib/fetch';
import './styles.scss';

type ErrorHandlerProps = {
  error: GenericError<any>;
  size?: 'small' | 'medium' | 'large' | 'full';
};

export function ErrorHandler({ size = 'medium', error }: ErrorHandlerProps) {
  if (isHttpErrorCode(422)(error)) {
    const data = JSON.parse(error.response as string) as UnexpectedErrorDto;
    const errors: string[] = [];

    Object.entries(data.errors).forEach(([key, explanations]) => {
      explanations.forEach((explanation) => {
        errors.push(key.concat(' ', explanation));
      });
    });

    return (
      <div className={cn('wrapper', `loader-${size}`)}>
        <ul className="error-messages">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn('wrapper', `loader-${size}`)}>
      <ul className="error-messages">
        <li key={error.errorType}>{error.explanation}</li>
      </ul>
    </div>
  );
}