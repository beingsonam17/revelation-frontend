'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from './index';
import { useGetMeQuery } from './api/authApi';
import { setCredentials } from './slices/authSlice';
import { Loader2 } from 'lucide-react';

/**
 * AuthInitializer — fires /auth/me immediately on mount using the HTTP-Only cookie.
 * It BLOCKS rendering of children until the session check completes (success OR error),
 * so that no other RTK Query request fires before the token is restored into Redux state.
 * This prevents race-condition 401s on hard refresh.
 */
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: userProfile, isSuccess, isError, isFetching } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && userProfile) {
      dispatch(setCredentials({ user: userProfile }));
    }
  }, [isSuccess, userProfile, dispatch]);

  // Block rendering until the session check has resolved (either way)
  if (isFetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-400 tracking-wider">Restoring session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
