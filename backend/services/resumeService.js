const fs = require('fs');
const pdfParse = require('pdf-parse');

const MASTER_SKILLS = [
  // Web development
  'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Next.js', 
  'TailwindCSS', 'REST APIs', 'GraphQL', 'Redux', 'Vue', 'Angular', 'SQL', 'PostgreSQL', 'Docker',
  
  // Mobile Development
  'React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Dart', 'Firebase',
  
  // Programming languages
  'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'PHP', 'Rust', 'MATLAB',
  
  // Design
  'Figma', 'Photoshop', 'Illustrator', 'Graphic Design', 'UI/UX', 'Logo Design', 'Branding', 
  'Vector Illustration', 'InDesign', 'Canva', 'Adobe XD',
  
  // Writing
  'Copywriting', 'SEO Writing', 'Content Writing', 'Blog Writing', 'Proofreading', 'Technical Writing',
  'Creative Writing', 'Editing',
  
  // Marketing & business
  'Social Media Marketing', 'Google Ads', 'SEO', 'Email Marketing', 'Content Strategy', 
  'Instagram Growth', 'TikTok Marketing', 'Google Analytics', 'Excel', 'Product Management'
];

const parseResume = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    const text = data.text;
    const matchedSkills = [];
    
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    
    MASTER_SKILLS.forEach(skill => {
      let regex;
      // Word boundary check for simple alphanumeric skills, direct check for symbols/punctuations
      if (/^[a-zA-Z0-9#]+$/.test(skill)) {
        regex = new RegExp('\\b' + escapeRegExp(skill) + '\\b', 'i');
      } else {
        regex = new RegExp(escapeRegExp(skill), 'i');
      }
      
      if (regex.test(text)) {
        matchedSkills.push(skill);
      }
    });
    
    return {
      text,
      matchedSkills
    };
  } catch (error) {
    throw new Error('Failed to parse resume: ' + error.message);
  }
};

module.exports = {
  parseResume,
  MASTER_SKILLS
};
