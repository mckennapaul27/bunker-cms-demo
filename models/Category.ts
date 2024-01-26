import mongoose from 'mongoose';
import Blog from './Blog';

mongoose.set('debug', true);

const CategorySchema = new mongoose.Schema(
    {
        metaTitle: String,
        metaDescription: String,
        name: String,
        slug: String,
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
    },
    {
        timestamps: true,
    }
);

CategorySchema.pre('validate', async function (next) {
    const category = this as any;
    category.status = 'draft';
    category.slug = category.slug.toLowerCase().replace(/ /g, '-');
    next();
});

CategorySchema.post('findOneAndUpdate', async function (result) {
    try {
        // Find all Blog documents where the category's ID matches the updated category
        const blogsToUpdate = await Blog.find({
            'category.category_id': result._id,
        });
        // Update the 'category.name' field in all matching Blog documents
        const updatePromises = blogsToUpdate.map(async (blog) => {
            blog.category.name = result.name;
            await blog.save();
        });
        await Promise.all(updatePromises);
    } catch (error: any) {
        console.log(error);
    }
});

const Category =
    mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;
