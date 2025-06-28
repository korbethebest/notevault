"use client";

import { supabase } from "@/shared/lib";

function useSignUp() {
	const signUp = async (email: string, password: string, nickname: string) => {
		// 1. Create user account
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
		});

		if (authError) {
			return { error: authError };
		}

		// 2. Store additional info (nickname)
		if (authData?.user) {
			try {
				const { error: userError } = await supabase.from("User").upsert({
					id: authData.user.id,
					email: authData.user.email,
					nickname,
					avatar_url: "",
					role: "user",
				});

				if (userError) {
					return { error: userError };
				}
			} catch (error) {
				if (error instanceof Error) {
					return { error: error };
				}
			}
		}

		const emailConfirmationRequired = authData.session === null;

		return {
			success: true,
			user: authData.user,
			emailConfirmationRequired,
		};
	};

	return { signUp };
}

export default useSignUp;
