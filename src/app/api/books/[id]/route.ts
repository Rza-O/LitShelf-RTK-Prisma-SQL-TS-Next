import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// get a single book
export const GET = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const book = await prisma.book.findUnique({
			where: { id: params.id },
			include: {
				author: true,
				category: true,
				coverImage: true,
			},
		});
		if (!book)
			return NextResponse.json(
				{ error: "single Book not found!" },
				{ status: 404 }
			);

		return NextResponse.json(book, { status: 200 });
	} catch (error) {
		console.log("error fetching single book by ID", error);
		return NextResponse.json(
			{ error: "failed to fetch single book" },
			{ status: 500 }
		);
	}
};


