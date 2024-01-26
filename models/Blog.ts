import mongoose from 'mongoose';

mongoose.set('debug', true);

const BlogSchema = new mongoose.Schema(
    {
        metaTitle: String,
        metaDescription: String,
        title: String,
        slug: String,
        description: String,
        image: {
            url: String,
            alt: String,
            width: Number,
            height: Number,
            public_id: String,
        },
        body: String,
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        category: {
            name: String,
            category_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
            },
        },
        tags: [
            {
                name: String,
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Tag',
                },
            },
        ],
        author: {
            name: String,
            author_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Author',
            },
        },
    },
    {
        timestamps: true,
    }
);

BlogSchema.pre('validate', async function (next) {
    const blog = this as any;
    blog.slug = blog.slug.toLowerCase().replace(/ /g, '-');
    next();
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default Blog;
