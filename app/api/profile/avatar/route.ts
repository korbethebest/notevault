import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("avatar") as File;
		const userId = formData.get("userId") as string;

		if (!file || !userId) {
			return NextResponse.json({ error: "File and userId are required" }, { status: 400 });
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
		}

		// Validate file size (5MB limit)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
		}

		// Create unique filename
		const fileExt = file.name.split(".").pop();
		const fileName = `${userId}-${Date.now()}.${fileExt}`;
		const filePath = `avatars/${fileName}`;

		// Convert File to ArrayBuffer
		const arrayBuffer = await file.arrayBuffer();
		const fileBuffer = new Uint8Array(arrayBuffer);

		// Upload to Supabase Storage
		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, fileBuffer, {
				contentType: file.type,
				upsert: true,
			});

		if (uploadError) {
			console.error("Upload error:", uploadError);
			return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
		}

		// Get public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from("avatars").getPublicUrl(filePath);

		// Ensure we have a valid URL by constructing it if needed
		const fullAvatarUrl =
			publicUrl ||
			`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`;

		// 먼저 사용자 정보를 확인
		const { error: userError } = await supabase.from("User").select("*").eq("id", userId).single();

		if (userError) {
			console.error("Error fetching user:", userError);
			return NextResponse.json({ error: "Failed to find user" }, { status: 404 });
		}

		// 명시적으로 avatar_url 필드만 업데이트
		const { error: updateError } = await supabase
			.from("User")
			.update({ avatar_url: fullAvatarUrl })
			.eq("id", userId)
			.select();

		if (updateError) {
			console.error("Database update error:", updateError);
			return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			avatar_url: publicUrl,
		});
	} catch (error) {
		console.error("Avatar upload error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json({ error: "userId is required" }, { status: 400 });
		}

		// Get current avatar URL to delete from storage
		const { data: userData, error: fetchError } = await supabase
			.from("User")
			.select("avatar_url")
			.eq("id", userId)
			.single();

		if (fetchError) {
			console.error("Fetch user error:", fetchError);
			return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
		}

		// Extract file path from URL if avatar exists
		if (userData?.avatar_url) {
			const url = new URL(userData.avatar_url);
			const filePath = url.pathname.split("/").slice(-2).join("/"); // Get 'avatars/filename'

			// Delete from storage
			const { error: deleteError } = await supabase.storage.from("avatars").remove([filePath]);

			if (deleteError) {
				console.error("Storage delete error:", deleteError);
			}
		}

		// Update user's avatar_url to null
		const { error: updateError } = await supabase
			.from("User")
			.update({ avatar_url: null })
			.eq("id", userId);

		if (updateError) {
			console.error("Database update error:", updateError);
			return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			message: "Avatar removed successfully",
		});
	} catch (error) {
		console.error("Avatar delete error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
