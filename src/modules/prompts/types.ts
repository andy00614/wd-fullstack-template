export interface Prompt {
	id: string;
	title: string;
	content: string;
	category: string;
	tags: string[];
	author: string;
	userId: string;
	favoritesCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface PromptWithFavorite extends Prompt {
	isFavorited: boolean;
	isOwner: boolean;
}

export interface PromptSearchParams {
	query?: string;
	category?: string;
	page?: number;
	limit?: number;
}
