import mongoose from 'mongoose';
import Project from './Project';

mongoose.set('debug', true);

const TechnologySchema = new mongoose.Schema(
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

TechnologySchema.pre('validate', async function (next) {
    const technology = this as any;
    technology.status = 'draft';
    technology.slug = technology.slug
        ? technology.slug.toLowerCase().replace(/ /g, '-')
        : technology.name.toLowerCase().replace(/ /g, '-');
    next();
});

TechnologySchema.post('findOneAndUpdate', async function (result) {
    try {
        // Find all Project documents where the technology's ID matches the updated technology
        const projectsToUpdate = await Project.find({
            'technology.technology_id': result._id,
        });
        // Update the 'technology.name' field in all matching Blog documents
        const updatePromises = projectsToUpdate.map(async (project) => {
            project.technology.name = result.name;
            await project.save();
        });
        await Promise.all(updatePromises);
    } catch (error: any) {
        console.log(error);
    }
});

const Technology =
    mongoose.models.Technology ||
    mongoose.model('Technology', TechnologySchema);

export default Technology;
