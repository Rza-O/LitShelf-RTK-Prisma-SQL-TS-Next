export interface Book {
	id: string;
	title: string;
	description: string;
	price: number;
	isbn: string;
	available: boolean;
	website?: string | null;
	publishedAt: string;
	author: {
		id: string;
		name: string;
		bio: string;
	};
	category: {
		id: string;
		name: string;
	};
	coverImage: {
		id: string;
		url: string;
		bookId: string;
	};
}
