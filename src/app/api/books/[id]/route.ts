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

// updating a single book
export const PUT = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const body = await req.json();
		const {
			title,
			description,
			price,
			isbn,
			available,
			authorName,
			categoryName,
			coverUrl,
		} = body;

		if (!title || !authorName || !categoryName) {
			return NextResponse.json(
				{ error: "Update: Missing Required Field" },
				{ status: 400 }
			);
		}

		// Looking for if the changed author exist or should create a new one
		const author = await prisma.author.upsert({
			where: { name: authorName },
			update: {},
			create: { name: authorName },
		});

		// Finding or creating the category
		const category = await prisma.category.upsert({
			where: { name: categoryName },
			update: {},
			create: { name: categoryName },
		});

		// now updating book
		const updateBook = await prisma.book.update({
			where: { id: params.id },
			data: {
				title,
				description,
				price,
				isbn,
				available,
				authorId: author.id,
				categoryId: category.id,
				coverImage: coverUrl
					? {
							upsert: {
								update: { url: coverUrl },
								create: { url: coverUrl },
							},
					  }
					: undefined,
			},
			include: { author: true, category: true, coverImage: true },
		});

		return NextResponse.json(updateBook, { status: 200 });
	} catch (error) {
		console.log(error, "error Updating book");
		return NextResponse.json(
			{ error: "Failed to update a book" },
			{ status: 500 }
		);
	}
};

// deleting a single book
export const DELETE = async (
	_req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const book = await prisma.book.delete({
			where: { id: params.id },
		});

		return NextResponse.json(
			{ message: "Book Deleted Successfully -> ", book },
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error deleting", error);
		return NextResponse.json(
			{ error: "Failed to delete book" },
			{ status: 500 }
		);
	}
};
