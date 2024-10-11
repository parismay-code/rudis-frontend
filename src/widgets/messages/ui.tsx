import { useEffect, useRef, useState } from 'react';
import { Message } from '~entities/messages';
import { MessageBlock } from '~shared/ui/message-block';
import { MessageInput } from '~shared/ui/message-input';
import './styles.scss';

type MessagesProps = {
  messages: Message[];
}

export function Messages({ messages }: MessagesProps) {
  const [replyId, setReplyId] = useState<number | null>(null);

  const messageBlockRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (messageBlockRef.current) {
      if (!scrolledRef.current) {
        messageBlockRef.current.scrollTo({ top: messageBlockRef.current.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  return <div className="messages">
    <div ref={messageBlockRef} className="messages__list" onScroll={() => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = undefined;
      }

      scrolledRef.current = true;

      scrollTimeoutRef.current = setTimeout(() => {
        scrolledRef.current = false;
        scrollTimeoutRef.current = undefined;
      }, 100);
    }}>
      {messages.map((message) => {
        return <MessageBlock key={message.id} message={message} messages={messages} setReplyId={setReplyId} />;
      })}
    </div>

    <MessageInput replyId={replyId} setReplyId={setReplyId} messages={messages} />
  </div>;
}