import mongoose from 'mongoose';
import Blog from './Blog';

mongoose.set('debug', true);

const AuthorSchema = new mongoose.Schema(
    {
        metaTitle: String,
        metaDescription: String,
        name: String,
        slug: String,
        bio: String,
        image: {
            url: String,
            alt: String,
            width: Number,
            height: Number,
            public_id: String,
        },
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

AuthorSchema.pre('validate', async function (next) {
    const author = this as any;
    author.status = 'draft';
    author.slug = author.slug.toLowerCase().replace(/ /g, '-');
    next();
});

AuthorSchema.post('findOneAndUpdate', async function (result) {
    try {
        // Find all Blog documents where the author's ID matches the updated author
        const blogsToUpdate = await Blog.find({
            'author.author_id': result._id,
        });
        // Update the 'author.name' field in all matching Blog documents
        const updatePromises = blogsToUpdate.map(async (blog) => {
            blog.author.name = result.name;
            await blog.save();
        });
        await Promise.all(updatePromises);
    } catch (error: any) {
        console.log(error);
    }
});

const Author = mongoose.models.Author || mongoose.model('Author', AuthorSchema);

export default Author;
