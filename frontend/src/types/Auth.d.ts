interface AuthUser {
	_id: string;
	email: string;
	username: string;
	fullName: string;
	role: number;
	lastLogin: string;
	avatarSrc: string;
	avatarInitials: "KN";
	id: string;
}

interface AuthState {
	user: AuthUser | null;
	accessToken: string | null;
}

export { AuthAction, AuthUser, AuthState };
