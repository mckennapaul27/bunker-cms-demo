import mongoose from 'mongoose';

mongoose.set('debug', true);

const PageSchema = new mongoose.Schema(
    {
        metaTitle: String,
        metaDescription: String,
        slug: String,
        body: String,
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

PageSchema.pre('validate', async function (next) {
    const blog = this as any;
    blog.slug = blog.slug.toLowerCase().replace(/ /g, '-');
    next();
});

const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);

export default Page;
