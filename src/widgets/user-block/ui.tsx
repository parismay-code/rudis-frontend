import cn from 'classnames';
import { User } from '~entities/users';
import './styles.scss';

type UserBlockProps = {
  user: Partial<User>;
  speaking?: boolean;
}

export function UserBlock({ user, speaking }: UserBlockProps) {
  return <div className="user-block">
    <div className={cn('user-block-avatar', speaking && 'speaking')}>
      {user.avatar && <img src={user.avatar} alt="Avatar" />}

      {!user.avatar && <div className="user-block-avatar__template" />}
    </div>

    <span className="user-block__login">{user.login}</span>
  </div>;
}