// MARGAM — Requests Screen Route (requests.tsx)
// Mounts the Incoming & Sent Matrimonial Requests Hub.

import React, { useState } from 'react';
import { router } from 'expo-router';
import { IncomingRequestsScreen } from '../../screens/IncomingRequestsScreen';
import { SAMPLE_INCOMING_REQUEST } from '../../constants/mockData';
import { IntroductionRequest } from '../../types';

export default function RequestsRoute() {
  const [incomingRequests, setIncomingRequests] = useState<IntroductionRequest[]>([
    SAMPLE_INCOMING_REQUEST,
  ]);
  const [sentRequests, setSentRequests] = useState<IntroductionRequest[]>([]);

  return (
    <IncomingRequestsScreen
      incomingRequests={incomingRequests}
      sentRequests={sentRequests}
      onAcceptRequest={(request) => {
        setIncomingRequests((prev) => prev.filter((r) => r.id !== request.id));
        router.push('/(tabs)/chat');
      }}
      onDeclineRequest={(requestId) => {
        setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
      }}
      onAskMoreInfo={(requestId) => {
        setIncomingRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: 'more_info_requested' } : r))
        );
      }}
      onWithdrawRequest={(requestId) => {
        setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
      }}
    />
  );
}
