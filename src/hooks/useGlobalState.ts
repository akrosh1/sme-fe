'use client';

import { RootState } from '@/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useGlobalState() {
  const initialToken =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [access, setAccess] = useState<string | null>(
    initialToken && initialToken !== 'undefined' && initialToken !== 'null'
      ? initialToken
      : null,
  );
  const reduxToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (reduxToken && reduxToken !== access) {
      setAccess(reduxToken);
      localStorage.setItem('token', reduxToken);
    } else if (
      !access &&
      initialToken &&
      initialToken !== 'undefined' &&
      initialToken !== 'null'
    ) {
      setAccess(initialToken);
    }
  }, [reduxToken, access]);

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

// components/GlobalStateProvider.tsx
// 'use client';

// import { TLoginResponse } from '@/validations/auth.validation';
// import { TUser } from '@/validations/user.validation';
// import { useMantineColorScheme } from '@mantine/core';
// import { useHotkeys, useLocalStorage } from '@mantine/hooks';
// import { produce } from 'immer';
// import React, { useEffect } from 'react';

// interface IState {
//   access: string | null;
//   refresh: string | null;
//   user: TUser | null | undefined;
// }

// const initialState: IState = {
//   access: typeof window !== 'undefined' ? localStorage.getItem('irerp_access') || null : null,
//   refresh: typeof window !== 'undefined' ? localStorage.getItem('irerp_refresh') || null : null,
//   user: undefined,
// };

// export interface IGlobalContext extends IState {
//   setUser: (user: TUser | null | undefined) => void;
//   setLogin: (payload: TLoginResponse) => void;
//   setLogout: () => void;
//   setAccessToken: (val: string | ((prevState: string) => string)) => void;
//   setRefreshToken: (val: string | ((prevState: string) => string)) => void;
// }

// export const GlobalContext = React.createContext<IGlobalContext>({
//   ...initialState,
//   setUser() {},
//   setLogin() {},
//   setLogout() {},
//   setAccessToken() {},
//   setRefreshToken() {},
// });

// const globalStateReducer = produce(
//   (
//     state: IState,
//     action: {
//       type: string;
//       payload?: unknown;
//     },
//   ) => {
//     switch (action.type) {
//       case 'SET_USER':
//         state.user = action.payload as TUser;
//         break;
//       case 'SET_LOGIN': {
//         const payload = action.payload as TLoginResponse;
//         state.access = payload.access;
//         state.refresh = payload.refresh;
//         state.user = undefined;
//         break;
//       }
//       case 'SET_LOGOUT': {
//         state.access = null;
//         state.refresh = null;
//         state.user = null;
//         break;
//       }
//       default:
//         break;
//     }
//   },
// );

// export default function GlobalStateProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [state, dispatch] = React.useReducer(globalStateReducer, initialState);
//   const { toggleColorScheme } = useMantineColorScheme();
//   const [accessToken, setAccessToken] = useLocalStorage({
//     key: 'irerp_access',
//     defaultValue: initialState.access || '',
//     serialize: (value: string) => value,
//     getInitialValueInEffect: false, // Read immediately
//   });
//   const [refreshToken, setRefreshToken] = useLocalStorage({
//     key: 'irerp_refresh',
//     defaultValue: initialState.refresh || '',
//     serialize: (value: string) => value,
//     getInitialValueInEffect: false, // Read immediately
//   });

//   useEffect(() => {
//     console.log('🚀 ~ GlobalStateProvider ~ accessToken:', accessToken);
//     console.log('🚀 ~ GlobalStateProvider ~ refreshToken:', refreshToken);
//     console.log('🚀 ~ GlobalStateProvider ~ state:', state);

//     if (accessToken && refreshToken && (accessToken !== state.access || refreshToken !== state.refresh)) {
//       dispatch({
//         type: 'SET_LOGIN',
//         payload: {
//           access: accessToken,
//           refresh: refreshToken,
//         },
//       });
//     }
//   }, [accessToken, refreshToken]);

//   useHotkeys([['mod+k', () => toggleColorScheme()]]);

//   const setUser = React.useCallback(
//     (user: TUser | null | undefined) => {
//       dispatch({ type: 'SET_USER', payload: user });
//     },
//     [],
//   );

//   const setLogin = React.useCallback(
//     (payload: TLoginResponse) => {
//       dispatch({ type: 'SET_LOGIN', payload });
//       if ('access' in payload) {
//         setAccessToken(payload.access);
//       }
//       if ('refresh' in payload) {
//         setRefreshToken(payload.refresh);
//       }
//     },
//     [setAccessToken, setRefreshToken],
//   );

//   const setLogout = React.useCallback(() => {
//     dispatch({ type: 'SET_LOGOUT' });
//     setAccessToken('');
//     setRefreshToken('');
//   }, [setAccessToken, setRefreshToken]);

//   return (
//     <GlobalContext.Provider
//       value={{
//         ...state,
//         setUser,
//         setLogin,
//         setLogout,
//         setAccessToken,
//         setRefreshToken,
//       }}
//     >
//       {children}
//     </GlobalContext.Provider>
//   );
// }
