import { Dispatch, SetStateAction, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '~shared/lib/websocket';
import { sessionService } from '~entities/session';
import { Message } from '~entities/messages';
import send from '~shared/assets/send.svg';
import close from '~shared/assets/close.svg';
import './styles.scss';

type MessageInputProps = {
  replyId: number | null;
  setReplyId: Dispatch<SetStateAction<number | null>>;
  messages: Message[];
}

export function MessageInput({ replyId, setReplyId, messages }: MessageInputProps) {
  const { id } = useParams();

  const user = sessionService.getCache();

  const ref = useRef<HTMLInputElement>(null);

  const replyMessage = messages.find((message) => message.id === replyId);

  return <div className="message-input">
    {replyMessage && <div className="message-input-reply">
      <p>Вы отвечаете на сообщение:</p>
      <p className="message-input-reply__text">{replyMessage.text}</p>

      <button className="message-input-reply__close" type='button' onClick={() => {
        setReplyId(null);
      }}>
        <img src={close} alt="Close" />
      </button>
    </div>}
    <form className="message-input__form" onSubmit={(event) => {
      event.preventDefault();

      if (ref.current?.value && user) {
        socket.emit('sendMessage', {
          text: ref.current.value,
          roomId: Number(id),
          replyId,
          user,
        });

        event.currentTarget.reset();
        setReplyId(null);
      }
    }}>
      <input className="message-input__field" type="text" ref={ref} placeholder="Message..." />
      <button className="message-input__submit" type="submit">
        <img src={send} alt="Send" />
      </button>
    </form>
  </div>;
}