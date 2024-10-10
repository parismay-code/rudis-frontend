import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalCameraStream } from '~shared/lib/hooks/useLocalCameraStream.tsx';
import { socket } from '~shared/lib/websocket';
import { User } from '~entities/users';
import { sessionService } from '~entities/session';
import { Message } from '~entities/messages';
import { Room } from '~entities/rooms';

type UserRTCData = {
  socketId: string | null;
  disconnected: boolean;
};

export type RoomUser = User & UserRTCData;

type RoomData = {
  model: Room;
  users: RoomUser[];
  messages: Message[];
}

type PeerConnectionData = {
  peerConnection: RTCPeerConnection;
  stream: MediaStream | null;
} & RoomUser;

type RequestOfferData = {
  from: string;
}

type OfferData = {
  offer: RTCSessionDescriptionInit,
  from: string;
}

type AnswerData = {
  answer: RTCSessionDescriptionInit,
  from: string;
}

type IceCandidateData = {
  candidate: RTCIceCandidate;
  from: string;
}

type NewParticipantData = {
  user: RoomUser;
}

type ParticipantLeftData = {
  socketId: string;
}

type MessageData = {
  message: Message;
}

type DeletedMessageData = {
  messageId: number;
}

export type MediaStreamData = {
  stream: MediaStream;
  user: RoomUser | User;
}

const iceServers = [{ urls: 'stun:stun2.1.google.com:19302' }];

export function useRoomConnection(password: string | null = null) {
  const [mediaStreams, setMediaStreams] = useState<Record<string, MediaStreamData>>({});
  const [messages, setMessages] = useState<Message[]>([]);

  const peers = useRef<Map<string, PeerConnectionData>>(new Map());

  const { id } = useParams();

  const user = sessionService.getCache() as User;

  const { localStream } = useLocalCameraStream();

  const connectRoom = useCallback(() => {
    socket.connect();

    socket.emit('participants', { id: Number(id) });
  }, [id]);

  const connectPeer = useCallback((user: RoomUser, requestOffer: boolean = true) => {
    if (!localStream) {
      return;
    }

    const socketId = user.socketId as string;

    const connection = new RTCPeerConnection({ iceServers });

    connection.onicecandidate = ({ candidate }) => {
      socket.emit('icecandidate', { candidate, to: socketId as string });
    };

    connection.ontrack = ({ streams }) => {
      const peerData = peers.current.get(socketId as string);

      if (!peerData) {
        return;
      }

      setMediaStreams((prev) => {
        return {
          ...prev,
          [socketId as string]: {
            stream: streams[0],
            user,
          },
        };
      });

      peers.current.set(socketId as string, { ...peerData, stream: streams[0] });
    };

    localStream.getTracks().forEach((track) => {
      connection.addTrack(track, localStream);
    });

    peers.current.set(socketId, { stream: null, peerConnection: connection, ...user });

    if (requestOffer) {
      socket.emit('requestOffer', { to: socketId });
    }
  }, [localStream]);

  const handleConnection = useCallback(() => {
    socket.emit('joinRoom', { id: Number(id), user, password });
  }, [id, user, password]);

  const connectPeers = useCallback((participants: RoomUser[]) => {
    for (const participant of participants) {
      if (participant.id === user.id || participant.disconnected) {
        continue;
      }

      if (participant.socketId) {
        connectPeer(participant);
      }
    }
  }, [user, connectPeer]);

  const handleIceCandidate = useCallback(async ({ candidate, from }: IceCandidateData) => {
    const peerData = peers.current.get(from);

    if (!peerData) {
      return;
    }

    await peerData.peerConnection.addIceCandidate(candidate);
  }, []);

  const handleNewParticipant = useCallback(({ user }: NewParticipantData) => {
    connectPeer(user, false);
  }, [connectPeer]);

  const handleParticipantDisconnected = useCallback(({ socketId }: ParticipantLeftData) => {
    const peerData = peers.current.get(socketId);

    if (!peerData) {
      return;
    }

    setMediaStreams((prev) => {
      delete prev[socketId];

      return {
        ...prev,
      };
    });

    peers.current.delete(socketId);

    peerData.peerConnection.close();
  }, []);

  const sendOffer = useCallback(async ({ from }: RequestOfferData) => {
    const peerData = peers.current.get(from);

    if (!peerData) {
      return;
    }

    const offer = await peerData.peerConnection.createOffer();
    await peerData.peerConnection.setLocalDescription(offer);

    socket.emit('sendOffer', { to: from, offer });
  }, []);

  const sendAnswer = useCallback(async ({ offer, from }: OfferData) => {
    const peerData = peers.current.get(from);

    if (!peerData) {
      return;
    }

    await peerData.peerConnection.setRemoteDescription(offer);
    const answer = await peerData.peerConnection.createAnswer();
    await peerData.peerConnection.setLocalDescription(answer);

    socket.emit('sendAnswer', { to: from, answer });
  }, []);

  const handleAnswer = useCallback(async ({ answer, from }: AnswerData) => {
    const peerData = peers.current.get(from);

    if (!peerData) {
      return;
    }

    await peerData.peerConnection.setRemoteDescription(answer);
  }, []);

  const handleRoomData = useCallback(async ({ messages }: RoomData) => {
    setMessages(messages);
  }, []);

  const handleMessageSent = useCallback(async ({ message }: MessageData) => {
    setMessages((prev) => {
      return [...prev, message];
    });
  }, []);

  const handleMessageDeleted = useCallback(async ({ messageId }: DeletedMessageData) => {
    setMessages((prev) => {
      return prev.filter((msg) => msg.id !== messageId);
    });
  }, []);

  useEffect(() => {
    if (localStream) {
      connectRoom();

      socket.on('roomData', handleRoomData);
      socket.on('connect', handleConnection);
      socket.on('participants', connectPeers);
      socket.on('newParticipant', handleNewParticipant);
      socket.on('participantDisconnected', handleParticipantDisconnected);
      socket.on('requestOffer', sendOffer);
      socket.on('offer', sendAnswer);
      socket.on('answer', handleAnswer);
      socket.on('icecandidate', handleIceCandidate);
      socket.on('message', handleMessageSent);
      socket.on('messageDeleted', handleMessageDeleted);

      return () => {
        socket.off('roomData', handleRoomData);
        socket.off('connect', handleConnection);
        socket.off('participants', connectPeers);
        socket.off('newParticipant', handleNewParticipant);
        socket.off('participantDisconnected', handleParticipantDisconnected);
        socket.off('requestOffer', sendOffer);
        socket.off('offer', sendAnswer);
        socket.off('answer', handleAnswer);
        socket.off('icecandidate', handleIceCandidate);
        socket.off('message', handleMessageSent);
        socket.off('messageDeleted', handleMessageDeleted);
      };
    }
  }, [localStream, connectRoom, handleConnection, connectPeers, handleNewParticipant, handleParticipantDisconnected, sendOffer, sendAnswer, handleAnswer, handleIceCandidate, handleRoomData, handleMessageSent, handleMessageDeleted]);

  return { localStream, mediaStreams, messages };
}