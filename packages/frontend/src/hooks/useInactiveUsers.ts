import { HocuspocusProvider } from '@hocuspocus/provider';
import { useState, useEffect, useRef } from 'react';
import { CollaborativeUser } from '../models/Collaborative';

export const useInactiveUsers = (provider?: HocuspocusProvider): CollaborativeUser[] => {
  const [inactiveUsers, setInactiveUsers] = useState<CollaborativeUser[]>([]);
  const lastInactiveUsers = useRef<CollaborativeUser[]>([]);

  useEffect(() => {
    if (!provider) return;

    const update = () => {
      const states = provider.awareness.getStates();

      const newInactiveUsers = Array.from(states.values())
        .filter((it) => it.user && !it.cursor && it.attached)
        .map((it) => it.user);

      if (lastInactiveUsers.current.length !== newInactiveUsers.length) {
        lastInactiveUsers.current = newInactiveUsers;

        setInactiveUsers(newInactiveUsers);
      }
    };

    provider.on('awarenessUpdate', update);

    return () => {
      provider.off('awarenessUpdate', update);
    }
  }, [provider]);

  return inactiveUsers;
};
