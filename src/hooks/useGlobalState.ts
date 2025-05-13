'use client';

import { useEffect, useState } from 'react';

export default function useGlobalState() {
  const [access, setAccess] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      setAccess(token);
    }
  }, []);

  const updateAccess = (newToken: string | null) => {
    setAccess(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  return { access, setAccess: updateAccess };
}
