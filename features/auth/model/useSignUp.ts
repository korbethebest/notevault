"use client";

import { createClientSupabaseClient } from "@/libs";

function useSignUp() {
	const signUp = async (email: string, password: string, nickname: string) => {
		const { data: authData, error: authError } = await createClientSupabaseClient().auth.signUp({
			email,
			password,
			options: {
				data: {
					nickname: nickname,
					avatar_url: "",
					role: "user",
				},
			},
		});

		if (authError) {
			return { error: authError };
		}

		const emailConfirmationRequired = authData.user && !authData.session;

		return {
			user: authData.user,
			emailConfirmationRequired,
			error: authError,
		};
	};

	return { signUp };
}

export default useSignUp;
