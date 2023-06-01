import { HocuspocusProvider } from '@hocuspocus/provider';
import { useState, useEffect, useRef } from 'react';
import { CollaborativeUser } from '../models/Collaborative';

export const useAttachedUsers = (provider?: HocuspocusProvider): CollaborativeUser[] => {
  const [attachedUsers, setAttachedUsers] = useState<CollaborativeUser[]>([]);
  const lastAttachedUsers = useRef<CollaborativeUser[]>([]);

  useEffect(() => {
    if (!provider) return;

    const update = () => {
      const states = provider.awareness.getStates();

      const newInactiveUsers = Array.from(states.values())
        .filter((it) => it.user && it.attached)
        .map((it) => it.user);

      if (lastAttachedUsers.current.length !== newInactiveUsers.length) {
        lastAttachedUsers.current = newInactiveUsers;

        setAttachedUsers(newInactiveUsers);
      }
    };

    provider.on('awarenessUpdate', update);

    return () => {
      provider.off('awarenessUpdate', update);
    }
  }, [provider]);

  return attachedUsers;
};
