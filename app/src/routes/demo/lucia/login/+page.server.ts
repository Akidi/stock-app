import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import * as auth from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { getUserByUsername, getUsers, insertUser, deleteUser } from '$lib/server/db/queries/users';
import { redirect } from '@sveltejs/kit';
import { ToastType } from '$lib/components/Toast/Toast.types';


export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/demo/lucia');
	}
	return {
		users: await getUsers()
	};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || typeof username !== 'string') {
			return {
				toast: {
					message: "Invalid Username",
					type: ToastType.Error,
				}
			}
		}

		if (!password || typeof password !== 'string') {
			return {
				toast: {
					message: "Invalid Password",
					type: ToastType.Error,
				}
			}
		}

		if (!validateUsername(username)) {
			return {
				toast: {
					message: "Invalid Username (min 3, max 31 alphanumeric characters.",
					type: ToastType.Error,
				}
			}
		}
		if (!validatePassword(password)) {
			return {
				toast: {
					message: "Invalid Password (min 6, max 255 characters.",
					type: ToastType.Error,
				}
			}
		}

		const existingUser = await getUserByUsername(username);

		if (!existingUser) {
			return {
				toast: {
					message: "Invalid Username and or Password.",
					type: ToastType.Error,
				}
			}
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return {
				toast: {
					message: "Invalid Username and or Password.",
					type: ToastType.Error,
				}
			}
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return {
			toast: {
				message: "Logged in successfully",
				type: ToastType.Success,
			}
		}
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || typeof username !== 'string') {
			return {
				"toast": {
					"message": "Invalid Username",
					"type": ToastType.Error,
				}
			};
		}

		if (!password || typeof password !== 'string') {
			return {
				status:400,
				toast: {
					message: "Invalid Password",
					type: ToastType.Error,
				}
			}
		}

		if (!validateUsername(username)) {
			return {
				status:400,
				toast: {
					message: "Invalid Username (min 3, max 31 alphanumeric characters.",
					type: ToastType.Error,
				}
			}
		}
		if (!validatePassword(password)) {
			return {
				status:400,
				toast: {
					message: "Invalid Password (min 6, max 255 characters.",
					type: ToastType.Error,
				}
			}
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
				await insertUser({ id: userId, username, passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return {
				status: 500,
				toast: {
					message: `An uncaught error has occured\nRaw Error Message: ${String(e)}`,
					type: ToastType.Error,
				}
			}
		}
		return {
			status: 200,
			toast: {
				message: "Logged in successfully",
				type: ToastType.Success,
			}
		}
	},
	delete: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id');
		if (!id || typeof id !== 'string') {
			return {
				status:400,
				toast: {
					message: "No user ID provided.",
					type: ToastType.Error,
				}
			};
		}

		try {
			const user = await deleteUser(id);
			if (user) {
				return {
					status: 200,
					toast: {
						message: `${user.username} deleted successfully.`,
						type: ToastType.Success,
					}
				}
			}
			return {
				status: 400,
				toast: {
					message: "Invalid user ID",
					type: ToastType.Warning
				}
			}
		} catch (e) {
			return {
				status: 500,
				toast: {
					message: `An uncaught error has occured:\nRaw error message: ${String(e)}`
				}
			}
		}
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateUsername(username: string): boolean {
	return (
		username.length >= 3 &&
		username.length <= 31 &&
		/^[A-Za-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: string): boolean {
	return password.length >= 6 && password.length <= 255;
}
