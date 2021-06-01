import React from 'react';
import ConversationsProvider from "./ConversationsProvider";
import Conversations from "./Conversations";

export default function ConversationsController() {
  return <ConversationsProvider>
    <Conversations/>
  </ConversationsProvider>
}
