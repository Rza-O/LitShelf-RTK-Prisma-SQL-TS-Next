import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET All books
export const GET = async () => {
	try {
		const books = await prisma.book.findMany({
			include: {
				author: true,
				category: true,
				coverImage: true,
			},
		});
		return NextResponse.json(books, { status: 200 });
	} catch (error) {
		console.log("Error in the GET Req~", error);
		return NextResponse.json(
			{ error: "Failed to GET books" },
			{ status: 500 }
		);
	}
};

// Add a new Book
export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const {
			title,
			description,
			price,
			isbn,
			available,
			authorId,
			categoryId,
			coverUrl,
		} = body;

		if (!title || !authorId || !categoryId) {
			return NextResponse.json(
				{ error: "Missing Required Fields" },
				{ status: 400 }
			);
		}

		const newBook = await prisma.book.create({
			data: {
				title,
				description,
				price,
				isbn,
				available,
				authorId,
				categoryId,
				coverImage: coverUrl ? { create: { url: coverUrl } } : undefined,
			},
			include: { author: true, category: true, coverImage: true },
		});

		return NextResponse.json(newBook, { status: 201 });
	} catch (error) {
		console.log("Error adding new book", error);
		return NextResponse.json(
			{ error: "Failed to create a book" },
			{ status: 500 }
		);
	}
};
