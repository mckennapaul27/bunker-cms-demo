import mongoose from 'mongoose';
import Project from './Project';

mongoose.set('debug', true);

const SkillSchema = new mongoose.Schema(
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

SkillSchema.pre('validate', async function (next) {
    const skill = this as any;
    skill.status = 'draft';
    skill.slug = skill.slug
        ? skill.slug.toLowerCase().replace(/ /g, '-')
        : skill.name.toLowerCase().replace(/ /g, '-');
    next();
});

SkillSchema.post('findOneAndUpdate', async function (result) {
    try {
        // Find all Project documents where the skill's ID matches the updated skill
        const projectsToUpdate = await Project.find({
            'skill.skill_id': result._id,
        });
        // Update the 'skill.name' field in all matching Blog documents
        const updatePromises = projectsToUpdate.map(async (project) => {
            project.skill.name = result.name;
            await project.save();
        });
        await Promise.all(updatePromises);
    } catch (error: any) {
        console.log(error);
    }
});

const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

export default Skill;
