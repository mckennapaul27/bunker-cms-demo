import mongoose from 'mongoose';

mongoose.set('debug', true);

const ProjectSchema = new mongoose.Schema(
    {
        metaTitle: String,
        metaDescription: String,
        title: String,
        slug: String,
        url: String,
        description: String,
        cover_image: {
            url: String,
            alt: String,
            width: Number,
            height: Number,
            public_id: String,
        },
        mockup_image: {
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
        skills: [
            {
                name: String,
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Skill',
                },
            },
        ],
        technologies: [
            {
                name: String,
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Technology',
                },
            },
        ],
        primary_color: { type: String, default: '' },
        secondary_color: { type: String, default: '' },
        accent_color: { type: String, default: '' },
        primary_font: { type: String, default: '' },
        secondary_font: { type: String, default: '' },
        accent_font: { type: String, default: '' },
        project_type: { type: String, default: '' }, // e.g 'local business', 'ecommerce', 'blog', 'portfolio', 'social media', 'forum', 'news', 'wiki', 'educational', 'entertainment', 'utility', 'other'
    },
    {
        timestamps: true,
    }
);

ProjectSchema.pre('validate', async function (next) {
    const project = this as any;
    console.log('project in pre hook', project);
    project.slug = project.title.toLowerCase().replace(/ /g, '-');
    next();
});

const Project =
    mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
