-- Insert sample tags
INSERT INTO tags (name, slug, color) VALUES
  ('Next.js', 'nextjs', '#000000'),
  ('React', 'react', '#61DAFB'),
  ('TypeScript', 'typescript', '#3178C6'),
  ('JavaScript', 'javascript', '#F7DF1E'),
  ('Web Development', 'web-development', '#FF6B6B'),
  ('Tutorial', 'tutorial', '#4ECDC4'),
  ('Tips', 'tips', '#45B7D1'),
  ('Performance', 'performance', '#96CEB4')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample admin user (you'll need to update this with your actual user data after first login)
INSERT INTO users (name, email, role, bio) VALUES
  ('Admin User', 'admin@example.com', 'admin', 'Blog administrator and main author.')
ON CONFLICT (email) DO NOTHING;
