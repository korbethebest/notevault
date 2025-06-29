"use client";

import { supabase } from "@/shared/lib";

function useSignUp() {
	const signUp = async (email: string, password: string, nickname: string) => {
		const { data: authData, error: authError } = await supabase.auth.signUp({
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
