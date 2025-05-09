import { TLoginResponse } from '@/validations/auth.validation';
import { TUser } from '@/validations/user.validation';
import { useMantineColorScheme } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { produce } from 'immer';
import React, { useEffect, useMemo } from 'react';

// Types
interface IState {
  access: string | null;
  refresh: string | null;
  user: TUser | null;
}

interface SetUserAction {
  type: 'SET_USER';
  payload: TUser | null;
}

interface SetLoginAction {
  type: 'SET_LOGIN';
  payload: TLoginResponse;
}

interface SetLogoutAction {
  type: 'SET_LOGOUT';
}

type Action = SetUserAction | SetLoginAction | SetLogoutAction;

export interface IGlobalContext extends IState {
  setUser: (user: TUser | null) => void;
  setLogin: (payload: TLoginResponse) => void;
  setLogout: () => void;
  setAccessToken: (val: string) => void;
  setRefreshToken: (val: string) => void;
}

// Initial State
const initialState: IState = {
  access: null,
  refresh: null,
  user: null,
};

// Context
export const GlobalContext = React.createContext<IGlobalContext>({
  ...initialState,
  setUser: () => {},
  setLogin: () => {},
  setLogout: () => {},
  setAccessToken: () => {},
  setRefreshToken: () => {},
});

// Reducer
const globalStateReducer = produce((state: IState, action: Action) => {
  switch (action.type) {
    case 'SET_USER':
      state.user = action.payload;
      break;
    case 'SET_LOGIN':
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.user = null;
      break;
    case 'SET_LOGOUT':
      state.access = null;
      state.refresh = null;
      state.user = null;
      break;
  }
});

// Provider
export default function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(globalStateReducer, initialState);
  const { toggleColorScheme } = useMantineColorScheme();

  // Local Storage
  const [accessToken, setAccessToken] = useLocalStorage<string>({
    key: 'irerp_access',
    defaultValue: '',
  });
  const [refreshToken, setRefreshToken] = useLocalStorage<string>({
    key: 'irerp_refresh',
    defaultValue: '',
  });

  // Sync tokens from local storage
  useEffect(() => {
    if (accessToken && refreshToken) {
      dispatch({
        type: 'SET_LOGIN',
        payload: { access: accessToken, refresh: refreshToken },
      });
    } else if (state.access || state.refresh) {
      dispatch({ type: 'SET_LOGOUT' });
    }
  }, [accessToken, refreshToken]);

  // Hotkeys (consider moving to a separate provider)
  useHotkeys([['mod+k', toggleColorScheme]]);

  // Actions
  const setUser = React.useCallback((user: TUser | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const setLogin = React.useCallback((payload: TLoginResponse) => {
    if (!payload?.access || !payload?.refresh) {
      console.error('Invalid login payload');
      return;
    }
    dispatch({ type: 'SET_LOGIN', payload });
    setAccessToken(payload.access);
    setRefreshToken(payload.refresh);
  }, []);

  const setLogout = React.useCallback(() => {
    dispatch({ type: 'SET_LOGOUT' });
    setAccessToken('');
    setRefreshToken('');
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      ...state,
      setUser,
      setLogin,
      setLogout,
      setAccessToken,
      setRefreshToken,
    }),
    [state, setUser, setLogin, setLogout],
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}
