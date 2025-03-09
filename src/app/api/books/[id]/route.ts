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

// Updating a single book
export const PUT = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const body = await req.json();
		const {
			title,
			description = "No description provided",
			price,
			isbn,
			available = true,
			authorName: authorObj,
			categoryName: categoryObj,
			coverUrl,
		} = body;

		const authorName =
			typeof authorObj === "object" ? authorObj.name : authorObj;
		const categoryName =
			typeof categoryObj === "object" ? categoryObj.name : categoryObj;

		if (!title || !authorName || !categoryName) {
			return NextResponse.json(
				{ error: "Update: Missing Required Field" },
				{ status: 400 }
			);
		}

		// Finding or creating the author
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

		// Updating the book
		const updatedBook = await prisma.book.update({
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
								update: { url: coverUrl }, // ✅ `url` is now correctly a string
								create: { url: coverUrl }, // ✅ Same correction here
							},
					  }
					: undefined,
			},
			include: { author: true, category: true, coverImage: true },
		});

		return NextResponse.json(updatedBook, { status: 200 });
	} catch (error: any) {
		console.error("Error updating book:", error);
		return NextResponse.json(
			{
				error: "Failed to update the book",
				details: error.message || "Unknown error",
			},
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
