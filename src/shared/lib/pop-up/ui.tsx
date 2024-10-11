import { useEffect } from 'react';
import cn from 'classnames';
import { usePopUpStore } from './model';
import './styles.scss';

export function PopUp() {
  const { closePopUp, prevPopUp, current, trace } = usePopUpStore();

  useEffect(() => {
    window.onkeydown = (event) => {
      if (event.code === 'Escape') {
        closePopUp();
      }
    };

    return () => {
      window.onkeydown = null;
    };
  }, [closePopUp]);

  return <div
    id="popUp"
    className={cn('pop-up', current && 'pop-up_visible')}
    onClick={(event) => {
      if (event.target === event.currentTarget) {
        closePopUp();
      }
    }}
  >
    {current && (
      <div className="pop-up__content">
        <div className="pop-up-header">
          <h1 className="pop-up-header__title">
            {current.title}
          </h1>

          <div className="pop-up-header-controls">
            {trace.length > 1 && (
              <button
                type="button"
                className="pop-up__button"
                onClick={prevPopUp}
              >
                Назад
              </button>
            )}

            <button
              type="button"
              className="pop-up__button"
              onClick={closePopUp}
            >
              Закрыть
            </button>
          </div>
        </div>

        <div className="pop-up__component">
          <current.Component />
        </div>
      </div>
    )}
  </div>;
}