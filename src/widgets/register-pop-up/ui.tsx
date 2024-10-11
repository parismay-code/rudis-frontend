import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { RegisterUserDto, RegisterUserDtoSchema, useRegisterUserMutation } from '~entities/session';
import { ErrorHandler } from '~shared/ui/error';
import { formikContract } from '~shared/lib/zod';

const initialValues: RegisterUserDto = {
  login: '',
  password: '',
  passwordConfirmation: '',
};

export function RegisterPopUp() {
  const { mutate: register, isPending, isError, error } = useRegisterUserMutation();

  return <div className="register-pop-up">
    {isError && <ErrorHandler error={error} />}

    <Formik
      initialValues={initialValues}
      validate={formikContract(RegisterUserDtoSchema)}
      onSubmit={(data) => register(data)}
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

          <fieldset className="form__group">
            <Field
              name="passwordConfirmation"
              className="form__control"
              type="password"
              placeholder="Password confirmation"
            />
            <ErrorMessage className="form__error" name="passwordConfirmation" />
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