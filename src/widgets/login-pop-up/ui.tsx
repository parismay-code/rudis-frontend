import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { LoginUserDto, LoginUserDtoSchema, useLoginUserMutation } from '~entities/session';
import { ErrorHandler } from '~shared/ui/error';
import { formikContract } from '~shared/lib/zod';

const initialValues: LoginUserDto = {
  login: '',
  password: '',
};

export function LoginPopUp() {
  const { mutate: login, isPending, isError, error } = useLoginUserMutation();

  return <div className="login-pop-up">
    {isError && <ErrorHandler error={error} />}

    <Formik
      initialValues={initialValues}
      validate={formikContract(LoginUserDtoSchema)}
      onSubmit={(data) => login(data)}
    >
      <Form className="form">
        <fieldset className="form__group" disabled={isPending}>
          <fieldset className="form__group">
            <Field
              name="login"
              className="form__control"
              type="text"
              placeholder="Login"
            />
            <ErrorMessage className="form__error" name="login" />
          </fieldset>

          <fieldset className="form__group">
            <Field
              name="password"
              className="form__control"
              type="password"
              placeholder="Password"
            />
            <ErrorMessage className="form__error" name="password" />
          </fieldset>

          <SubmitButton />
        </fieldset>
      </Form>
    </Formik>
  </div>;
}

function SubmitButton() {
  const { isValidating, isValid } = useFormikContext();

  return <button className="form__submit" type="submit" disabled={!isValid || isValidating}>Submit</button>;
}