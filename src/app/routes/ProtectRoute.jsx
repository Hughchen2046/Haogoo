import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { checkThunk } from '../features/auth/authThunks';
import { IsAuthed, AuthStatus } from '../features/auth/authSelectors';
import LazyImage from '../../components/LazyImage';

export default function ProtectRoute() {
  const dispatch = useDispatch();
  const authStatus = useSelector(AuthStatus);
  const isAuthed = useSelector(IsAuthed);
  // console.log('authStatus:', authStatus, 'isAuthed:', isAuthed);

  useEffect(() => {
    // console.log('authStatus:', authStatus, 'isAuthed:', isAuthed);
    if (authStatus === 'idle') {
      dispatch(checkThunk());
    }
  }, [authStatus, dispatch]);

  if (authStatus === 'idle' || authStatus === 'checking') {
    return (
      <>
        <LazyImage />
      </>
    );
  }

  if (authStatus === 'failed' || !isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

