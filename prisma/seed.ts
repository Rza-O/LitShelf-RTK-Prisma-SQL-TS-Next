import { prisma } from "@/lib/prisma";

async function main() {
	console.log("🌱 Seeding the database...");

	// Create authors
	const authors = await prisma.author.createMany({
		data: [
			{
				id: "author1",
				name: "Robert C. Martin",
				bio: "Author of Clean Code",
			},
			{
				id: "author2",
				name: "Fred Brooks",
				bio: "Author of The Mythical Man-Month",
			},
			{
				id: "author3",
				name: "Andrew Hunt",
				bio: "Author of The Pragmatic Programmer",
			},
			{
				id: "author4",
				name: "Martin Kleppmann",
				bio: "Author of Designing Data-Intensive Applications",
			},
			{
				id: "author5",
				name: "Thomas H. Cormen",
				bio: "Author of Introduction to Algorithms",
			},
		],
	});

	console.log("✅ Authors seeded!");

	// Create categories
	const category = await prisma.category.upsert({
		where: { name: "Software Engineering" },
		update: {},
		create: { id: "category1", name: "Software Engineering" },
	});

	console.log("✅ Category seeded!");

	// Create books
	const books = await prisma.book.createMany({
		data: [
			{
				id: "book1",
				title: "Clean Code",
				description: "A Handbook of Agile Software Craftsmanship",
				price: 29.99,
				isbn: "9780132350884",
				available: true,
				authorId: "author1",
				categoryId: "category1",
			},
			{
				id: "book2",
				title: "The Mythical Man-Month",
				description: "Essays on Software Engineering",
				price: 24.99,
				isbn: "9780201835953",
				available: true,
				authorId: "author2",
				categoryId: "category1",
			},
			{
				id: "book3",
				title: "The Pragmatic Programmer",
				description: "Your Journey to Mastery",
				price: 35.99,
				isbn: "9780135957059",
				available: true,
				authorId: "author3",
				categoryId: "category1",
			},
			{
				id: "book4",
				title: "Designing Data-Intensive Applications",
				description:
					"The Big Ideas Behind Reliable, Scalable, and Maintainable Systems",
				price: 39.99,
				isbn: "9781449373320",
				available: true,
				authorId: "author4",
				categoryId: "category1",
			},
			{
				id: "book5",
				title: "Introduction to Algorithms",
				description: "A comprehensive introduction to algorithms",
				price: 89.99,
				isbn: "9780262033848",
				available: true,
				authorId: "author5",
				categoryId: "category1",
			},
		],
	});

	console.log("✅ Books seeded!");

	// Create cover images
	const images = await prisma.image.createMany({
		data: [
			{
				url: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
				bookId: "book1",
			},
			{
				url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348430512i/13629.jpg",
				bookId: "book2",
			},
			{
				url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/tpp20.jpg",
				bookId: "book3",
			},
			{
				url: "https://m.media-amazon.com/images/I/91YfNb49PLL._SL1500_.jpg",
				bookId: "book4",
			},
			{
				url: "https://5.imimg.com/data5/IOS/Default/2024/2/390540651/XP/LF/RK/112007100/product-jpeg.png",
				bookId: "book5",
			},
		],
	});

	console.log("✅ Cover images seeded!");

	console.log("🎉 Seeding complete!");
}
main()
	.catch((e) => console.error(e))
	.finally(async () => {
		await prisma.$disconnect();
	});
