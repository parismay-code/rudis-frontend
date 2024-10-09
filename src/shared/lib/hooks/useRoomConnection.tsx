import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalCameraStream } from '~shared/lib/hooks/useLocalCameraStream.tsx';
import { socket } from '~shared/lib/websocket';
import { User } from '~entities/users';
import { sessionService } from '~entities/session';

type UserRTCData = {
  muted: boolean;
  videoEnabled: boolean;
  role: string | null;
  socketId: string | null;
  disconnected: boolean;
};

type RoomUser = User & UserRTCData;

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

const iceServers = [{ urls: 'stun:stun2.1.google.com:19302' }];

export function useRoomConnection() {
  const [mediaStreams, setMediaStreams] = useState<Record<string, MediaStream>>({});

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

      for (const track of streams[0].getTracks()) {
        track.onmute = () => {
          if (track.kind === 'audio') {
            console.log('audio muted');
          } else {
            console.log('video muted');
          }
        };
      }

      setMediaStreams((prev) => {
        return {
          ...prev,
          [socketId as string]: streams[0],
        };
      });

      peers.current.set(socketId as string, { ...peerData, stream: streams[0] });
    };

    localStream.getTracks().forEach((track) => {
      if (track.kind === 'video') {
        track.enabled = false;
      }

      connection.addTrack(track, localStream);
    });

    peerHealthcheckInterval.current = setInterval(() => {
      if (connection.iceConnectionState === 'disconnected') {
        peers.current.delete(socketId);

        clearInterval(peerHealthcheckInterval.current);
        peerHealthcheckInterval.current = undefined;
      }
    }, 100);

    peers.current.set(socketId, { stream: null, peerConnection: connection, ...user });

    if (requestOffer) {
      socket.emit('requestOffer', { to: socketId });
    }
  }, [localStream]);

  const peerHealthcheckInterval = useRef<NodeJS.Timeout>();

  const handleConnection = useCallback(() => {
    socket.emit('joinRoom', { id: Number(id), user });
  }, [id, user]);

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

  useEffect(() => {
    if (localStream) {
      connectRoom();

      socket.on('connect', handleConnection);
      socket.on('participants', connectPeers);
      socket.on('newParticipant', handleNewParticipant);
      socket.on('participantDisconnected', handleParticipantDisconnected);
      socket.on('requestOffer', sendOffer);
      socket.on('offer', sendAnswer);
      socket.on('answer', handleAnswer);
      socket.on('icecandidate', handleIceCandidate);

      return () => {
        socket.off('connect', handleConnection);
        socket.off('participants', connectPeers);
        socket.off('newParticipant', handleNewParticipant);
        socket.off('participantDisconnected', handleParticipantDisconnected);
        socket.off('requestOffer', sendOffer);
        socket.off('offer', sendAnswer);
        socket.off('answer', handleAnswer);
        socket.off('icecandidate', handleIceCandidate);
      };
    }
  }, [localStream, connectRoom, handleConnection, connectPeers, handleNewParticipant, handleParticipantDisconnected, sendOffer, sendAnswer, handleAnswer, handleIceCandidate]);

  return { localStream, mediaStreams };
}