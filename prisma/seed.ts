import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding database...");

	// Seed Categories
	const categories = await prisma.category.createMany({
		data: [
			{ name: "Science Fiction" },
			{ name: "Mystery" },
			{ name: "Fantasy" },
			{ name: "Non-Fiction" },
		],
	});

	console.log(`✅ Added ${categories.count} categories`);

	// Seed Authors
	const author1 = await prisma.author.create({
		data: {
			name: "Frank Herbert",
			bio: "Author of Dune and other science fiction novels.",
		},
	});

	console.log(`✅ Added author: ${author1.name}`);

	// Find category ID
	const category = await prisma.category.findFirst({
		where: { name: "Science Fiction" },
	});

	if (!category) {
		throw new Error("❌ Category not found!");
	}

	// Seed Books
	const book1 = await prisma.book.create({
		data: {
			title: "Dune",
			description: "A classic science fiction novel about a desert planet.",
			price: 19.99,
			isbn: "9780441013593",
			available: true,
			website: "https://example.com/dune",
			publishedAt: new Date("1965-08-01"),
			categoryId: category.id,
			authorId: author1.id,
			coverImage: {
				create: { url: "https://example.com/dune.jpg" },
			},
		},
	});

	console.log(`✅ Added book: ${book1.title}`);

	console.log("🌱 Seeding completed!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
