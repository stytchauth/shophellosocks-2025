'use client';

import Header from './Header';

interface ClientHeaderProps {
  useAuthedHeader: boolean;
  animatePrimaryButton?: boolean;
  disablePrimaryButton?: boolean;
}

export default function ClientHeader({
  useAuthedHeader,
  animatePrimaryButton = true,
  disablePrimaryButton = false,
}: ClientHeaderProps) {
  const handleLogout = () => {
    // Navigate to logout endpoint which will handle session revocation and redirect
    window.location.href = '/api/logout';
  };

  return (
    <Header
      onCartClick={() => {}}
      onLogin={() => {}}
      onLogout={handleLogout}
      useAuthedHeader={useAuthedHeader}
      animatePrimaryButton={animatePrimaryButton}
      disablePrimaryButton={disablePrimaryButton}
    />
  );
}
