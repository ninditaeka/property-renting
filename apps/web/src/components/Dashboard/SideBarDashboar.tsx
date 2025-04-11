import { useRouter } from 'next/router';
import { AuthState, logoutUser } from '@/store/authSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/store';

export default function SideBarDashboard({ role, isOpen }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector<RootState>(
    (state) => state.auth,
  ) as AuthState;
  const handleLogOut = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(logoutUser()).unwrap();
    } catch (err) {
      // Error handling sudah ditangani di slice
      console.error('Login failed');
    }
  };

  return (
    <div
      className={`fixed pt-20 left-0 top-0 h-full bg-white text-white w-64 transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {role == 'event_organizer' && <div></div>}
    </div>
  );
}
