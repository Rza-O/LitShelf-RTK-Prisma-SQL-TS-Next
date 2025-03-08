export interface Book {
	id: string;
	title: string;
	description: string;
	price: number;
	isbn: string;
	available: boolean;
	website?: string;
	publishedAt: string;

	author: {
		id: string;
		name: string;
		bio?: string;
	};

	category: {
		id: string;
		name: string;
	};

	coverImage?: {
		id: string;
		url: string;
	};
}

export interface FormState {
	id: string;
	title: string;
	description: string;
	price: number | "";
	isbn: string;
	available: boolean;
	website: string;
	authorName: string;
	categoryName: string;
	coverUrl: string;
}
