import Author from '@/models/Author';
import Category from '@/models/Category';

export const formatAuthor = async (author_id: string) => {
    const author = await Author.findById(author_id);
    if (author) {
        return {
            name: author.name,
            author_id: author._id,
        };
    }
    return null;
};
export const formatCategory = async (category_id: string) => {
    const category = await Category.findById(category_id);
    if (category) {
        return {
            name: category.name,
            category_id: category._id,
        };
    }
    return null;
};
