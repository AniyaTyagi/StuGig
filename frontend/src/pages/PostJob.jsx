import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { jobService } from '../services/jobService';
import toast from 'react-hot-toast';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    jobType: 'project',
    skills: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const jobData = {
        ...formData,
        budget: Number(formData.budget),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      await jobService.createJob(jobData);
      toast.success('Job posted successfully!');
      navigate('/dashboard/client');
    } catch (error) {
      toast.error(error?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Briefcase className="text-primary-800" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-medium">Post a New Job</h1>
              <p className="text-sm text-gray-600">Find the perfect student freelancer for your project</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                placeholder="e.g., Build a React E-commerce Website"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Video Editing">Video Editing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Type *</label>
                <select
                  name="jobType"
                  required
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                >
                  <option value="project">Project Gig</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                required
                rows={8}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                placeholder="Describe your project requirements, deliverables, and expectations..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Budget ($) *</label>
                <input
                  type="number"
                  name="budget"
                  required
                  min="10"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deadline *</label>
                <input
                  type="date"
                  name="deadline"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Required Skills *</label>
              <input
                type="text"
                name="skills"
                required
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                placeholder="React, Node.js, MongoDB (comma separated)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded-lg font-medium disabled:bg-gray-300 transition"
              >
                {submitting ? 'Posting...' : 'Post Job'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
