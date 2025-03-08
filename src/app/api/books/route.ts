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
export async function POST(req: Request) {
	try {
		const data = await req.json(); // ✅ Ensure JSON parsing
		console.log("Received Data:", data); // ✅ Add this for debugging

		const newBook = await prisma.book.create({
			data: {
				title: data.title,
				description: data.description,
				price: data.price,
				isbn: data.isbn,
				website: data.website,
				author: {
					connectOrCreate: {
						where: { name: data.author.name },
						create: { name: data.author.name },
					},
				},
				category: {
					connectOrCreate: {
						where: { name: data.category.name },
						create: { name: data.category.name },
					},
				},
				coverImage: { create: { url: data.coverUrl } },
				publishedAt: data.publishedAt,
			},
		});

		return NextResponse.json(newBook, { status: 201 });
	} catch (error) {
		console.error("Error adding new book:", error);
		return NextResponse.json(
			{ error: "Failed to add book" },
			{ status: 500 }
		);
	}
}
