import { Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import { Message } from '~entities/messages';
import { UserBlock } from '~widgets/user-block';
import { sessionService } from '~entities/session';
import { User } from '~entities/users';
import { socket } from '~shared/lib/websocket';
import reply from '~shared/assets/reply.svg';
import del from '~shared/assets/delete.svg';
import './styles.scss';

type MessageBlockProps = {
  message: Message;
  setReplyId: Dispatch<SetStateAction<number | null>>;
  messages: Message[];
};

export function MessageBlock({ message, setReplyId, messages }: MessageBlockProps) {
  const { id } = useParams();

  const user = sessionService.getCache() as User;

  const replyMessage = messages.find((_message) => _message.id === message.reply?.id);

  return <div className="message-block" id={`message_${message.id}`}>
    <UserBlock user={message.user} />

    {replyMessage && <div className="message-block-reply">
      <p className="message-block-reply__author">{`${replyMessage.user.login} пишет:`}</p>
      <p className="message-block-reply__text">{replyMessage.text}</p>
    </div>}

    <p className="message-block__text">
      {message.text}
    </p>

    <div className="message-block-controls">
      <button className={cn('message-block-controls__button', message.id === replyMessage?.id && 'active')}
              type="button" onClick={() => {
        setReplyId(message.id);
      }}>
        <img src={reply} alt="Reply" />
      </button>

      {message.user.id === user.id && <button className="message-block-controls__button" type="button" onClick={() => {
        socket.emit('deleteMessage', { messageId: message.id, roomId: id, user });
      }}>
        <img src={del} alt="Delete" />
      </button>}
    </div>
  </div>;
}