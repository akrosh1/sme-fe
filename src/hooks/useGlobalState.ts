'use client';

import { RootState } from '@/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useGlobalState() {
  const initialToken =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const initialRefreshToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('refresh_token')
      : null;
  const initialRole =
    typeof window !== 'undefined' ? localStorage.getItem('active_role') : null;

  const [access, setAccess] = useState<string | null>(
    initialToken && initialToken !== 'undefined' && initialToken !== 'null'
      ? initialToken
      : null,
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    initialRefreshToken &&
      initialRefreshToken !== 'undefined' &&
      initialRefreshToken !== 'null'
      ? initialRefreshToken
      : null,
  );
  const [activeRole, setActiveRole] = useState<string | null>(
    initialRole && initialRole !== 'undefined' && initialRole !== 'null'
      ? initialRole
      : null,
  );

  const reduxToken = useSelector((state: RootState) => state.auth.token);
  const reduxRefreshToken = useSelector(
    (state: RootState) => state.auth.refresh,
  );
  const reduxRole = useSelector((state: RootState) => state.auth.active_role);

  useEffect(() => {
    if (reduxToken && reduxToken !== access) {
      setAccess(reduxToken);
      localStorage.setItem('token', reduxToken);
    }
    if (reduxRefreshToken && reduxRefreshToken !== refreshToken) {
      setActiveRole(reduxRefreshToken);
      localStorage.setItem('refresh_token', reduxRefreshToken);
    }
    if (reduxRole && reduxRole !== activeRole) {
      setActiveRole(reduxRole);
      localStorage.setItem('active_role', reduxRole);
    }
    if (
      !access &&
      initialToken &&
      initialToken !== 'undefined' &&
      initialToken !== 'null'
    ) {
      setAccess(initialToken);
    }
    if (
      !refreshToken &&
      initialRefreshToken &&
      initialRefreshToken !== 'undefined' &&
      initialRefreshToken !== 'null'
    ) {
      setRefreshToken(initialRefreshToken);
    }
    if (
      !activeRole &&
      initialRole &&
      initialRole !== 'undefined' &&
      initialRole !== 'null'
    ) {
      setActiveRole(initialRole);
    }
  }, [
    reduxToken,
    reduxRefreshToken,
    reduxRole,
    access,
    refreshToken,
    activeRole,
    initialToken,
    initialRefreshToken,
    initialRole,
  ]);

  const updateAccess = (
    newToken: string | null,
    newRefreshToken: string | null,
    newRole: string | null,
  ) => {
    setAccess(newToken);
    setRefreshToken(newRefreshToken);
    setActiveRole(newRole);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    } else {
      localStorage.removeItem('refresh_token');
    }
    if (newRole) {
      localStorage.setItem('active_role', newRole);
    } else {
      localStorage.removeItem('active_role');
    }
  };

  return { access, activeRole, refreshToken, setAccess: updateAccess };
}
