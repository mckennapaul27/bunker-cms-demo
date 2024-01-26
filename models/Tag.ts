import mongoose from 'mongoose';
import Blog from './Blog';

mongoose.set('debug', true);

const TagSchema = new mongoose.Schema(
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

TagSchema.pre('validate', async function (next) {
    const tag = this as any;
    tag.status = 'draft';
    tag.slug = tag.slug
        ? tag.slug.toLowerCase().replace(/ /g, '-')
        : tag.name.toLowerCase().replace(/ /g, '-');
    next();
});

TagSchema.post('findOneAndUpdate', async function (result) {
    try {
        // Find all Blog documents where the tag's ID matches the updated tag
        const blogsToUpdate = await Blog.find({
            'tag.tag_id': result._id,
        });
        // Update the 'tag.name' field in all matching Blog documents
        const updatePromises = blogsToUpdate.map(async (blog) => {
            blog.tag.name = result.name;
            await blog.save();
        });
        await Promise.all(updatePromises);
    } catch (error: any) {
        console.log(error);
    }
});

const Tag = mongoose.models.Tag || mongoose.model('Tag', TagSchema);

export default Tag;
