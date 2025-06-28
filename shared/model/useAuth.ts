"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "../lib";

function useAuth() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
			},
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return { user };
}

export default useAuth;
