'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './index';
import { useGetMeQuery } from './api/authApi';
import { setCredentials } from './slices/authSlice';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: userProfile, isSuccess } = useGetMeQuery(undefined, {
    refetchOnMountOrChange: true,
  });

  useEffect(() => {
    if (isSuccess && userProfile) {
      dispatch(setCredentials({ user: userProfile }));
    }
  }, [isSuccess, userProfile, dispatch]);

  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
