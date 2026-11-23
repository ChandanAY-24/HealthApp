// Client session and security helpers
export const isUserAuthenticated = (): boolean => {
  return true; // Single-person personal health record
};

export const getSessionUser = () => {
  return {
    id: 'user_primary',
    role: 'patient',
    name: 'Alex Rivera',
    avatarInitials: 'AR',
  };
};
