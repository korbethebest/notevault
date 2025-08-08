"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { createClientSupabaseClient } from "@/libs";

function useAuth() {
	const [user, setUser] = useState<User | null | undefined>(undefined); // 초기값을 undefined로 설정
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const supabase = createClientSupabaseClient();

		// 초기 사용자 상태 확인
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
			setIsLoading(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return {
		user,
		isLoading,
		isSignedIn: !!user,
	};
}

export default useAuth;
