export const AuthCheck = (state) => state.auth;
export const AuthStatus = (state) => state.auth.status;
export const authUser = (state) => state.auth.user;
export const authToken = (state) => state.auth.token;

export const IsAuthed = (state) => !!state.auth.token;
export const IsChecking = (state) => state.auth.status === 'checking';
