'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from './index';
import { useGetMeQuery } from './api/authApi';
import { setCredentials } from './slices/authSlice';

/**
 * AuthInitializer — silently fires /auth/me on mount using the HTTP-Only cookie.
 * It restores the session into Redux WITHOUT blocking page render.
 * Public pages load instantly. Admin/dashboard routes guard themselves via their own layout.
 */
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: userProfile, isSuccess } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && userProfile) {
      dispatch(setCredentials({ user: userProfile }));
    }
  }, [isSuccess, userProfile, dispatch]);

  // Always render children immediately — no blocking spinner on public pages
  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
