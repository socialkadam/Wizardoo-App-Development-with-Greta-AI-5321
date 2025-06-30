# Wizardoo MVP - Complete Platform

A comprehensive wizard-seeker matching platform built with React, Tailwind CSS, and Supabase. Connect seekers with expert coaches, mentors, counselors, and consultants through intelligent archetype matching.

## 🚀 Features

### Core Functionality
- **Seeker Quiz**: 6-question assessment to determine communication archetype
- **Wizard Vetting**: 25-question comprehensive assessment with scoring system
- **Wizard Directory**: Browse and filter approved wizards by archetype
- **Wizard Profiles**: Detailed profiles with booking integration
- **Wizardoo Academy**: 4-module training system with progress tracking

### User Experience
- Responsive design optimized for all devices
- Beautiful animations with Framer Motion
- Intuitive navigation and user flows
- Professional UI/UX design

### Technical Features
- React 18 with modern hooks
- Tailwind CSS for styling
- Supabase for backend database
- React Router for navigation
- Framer Motion for animations
- React Icons for consistent iconography

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing with HashRouter
- **Framer Motion**: Animation library

### Backend Integration
- **Supabase**: PostgreSQL database with real-time features
- **Authentication**: Ready for Supabase Auth integration
- **API**: RESTful API calls through Supabase client

## 📊 Database Schema

### Required Supabase Tables

```sql
-- Wizard profiles
CREATE TABLE wizard_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  archetype text NOT NULL CHECK (archetype IN ('coach', 'mentor', 'counselor', 'consultant')),
  bio text,
  long_description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  hourly_rate integer,
  location text,
  booking_url text,
  image_url text,
  specialties text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Seeker profiles
CREATE TABLE seeker_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  recommended_archetype text NOT NULL,
  answers jsonb NOT NULL,
  completed_at timestamp with time zone DEFAULT now()
);

-- Quiz attempts (for wizard vetting)
CREATE TABLE quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  total_score integer NOT NULL,
  percentage integer NOT NULL,
  primary_archetype text NOT NULL,
  archetype_scores jsonb NOT NULL,
  answers jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('approved', 'academy_required', 'retry_required')),
  completed_at timestamp with time zone DEFAULT now()
);

-- Academy progress
CREATE TABLE academy_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  module1_complete boolean DEFAULT false,
  module2_complete boolean DEFAULT false,
  module3_complete boolean DEFAULT false,
  module4_complete boolean DEFAULT false,
  final_quiz_available boolean DEFAULT false,
  final_quiz_complete boolean DEFAULT false,
  completion_percentage integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);
```

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd wizardoo-mvp
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabase Setup
1. Create a new Supabase project
2. Run the database schema (see Database Schema section)
3. Configure Row Level Security (RLS) policies as needed
4. Add your project URL and anon key to `.env`

### 4. Development
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## 📱 Pages & Features

### Home Page (`/`)
- Hero section with clear value proposition
- Archetype overview cards
- Statistics and social proof
- Call-to-action buttons

### Seeker Quiz (`/quiz/seeker`)
- 6-question archetype assessment
- Progress tracking
- Results page with archetype explanation
- Direct navigation to matching wizards

### Wizard Vetting (`/quiz/wizard`)
- 25-question comprehensive assessment
- Scoring system (75%+ approved, 60-74% academy, <60% retry)
- Archetype analysis
- Status-based next steps

### Wizard Directory (`/wizards`)
- Grid layout of approved wizards
- Filter by archetype
- Search functionality
- Wizard cards with key information

### Wizard Profile (`/wizards/:id`)
- Detailed wizard information
- Booking integration
- Reviews and ratings
- Specialties and experience

### Wizardoo Academy (`/academy`)
- 4 training modules
- Progress tracking
- Module completion system
- Final certification quiz

## 🎨 Design System

### Colors
- **Primary Purple**: `#7c3aed` (purple-600)
- **Secondary Blue**: `#3b82f6` (blue-600)
- **Success Green**: `#10b981` (emerald-500)
- **Warning Yellow**: `#f59e0b` (amber-500)
- **Error Red**: `#ef4444` (red-500)

### Archetypes
Each archetype has its own color scheme:
- **Coach**: Green gradient (`from-green-500 to-emerald-600`)
- **Mentor**: Yellow gradient (`from-yellow-500 to-orange-600`)
- **Counselor**: Pink gradient (`from-pink-500 to-rose-600`)
- **Consultant**: Blue gradient (`from-blue-500 to-indigo-600`)

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable sans-serif
- **UI Elements**: Medium weight for buttons and labels

## 🔧 Configuration

### Router Setup
Uses HashRouter for compatibility with static hosting:
```jsx
import { HashRouter as Router } from 'react-router-dom';
```

### Supabase Integration
Database helper functions in `src/config/supabase.js`:
- `getApprovedWizards()` - Fetch wizard directory
- `saveQuizAttempt()` - Save wizard vetting results
- `saveSeekerProfile()` - Save seeker quiz results
- `updateAcademyProgress()` - Track academy completion

### Icon System
Uses SafeIcon component for consistent icon rendering:
```jsx
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

<SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5" />
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### Other Platforms
The app builds to static files in `dist/` directory and can be deployed to any static hosting service.

## 🔐 Environment Variables

### Required
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional
- `VITE_APP_URL` - Your production domain (for OpenGraph/SEO)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Seeker quiz completes and shows results
- [ ] Wizard quiz calculates scores correctly
- [ ] Directory filtering works
- [ ] Wizard profiles display properly
- [ ] Academy progress tracking functions
- [ ] Responsive design on mobile
- [ ] All navigation links work

### Automated Testing
```bash
npm run lint        # ESLint checks
npm run build       # Build verification
```

## 📈 Analytics & Tracking

Ready for integration with:
- Google Analytics
- Mixpanel
- PostHog
- Custom analytics

Event tracking points are already identified in components for easy integration.

## 🔒 Security Considerations

### Supabase Security
- Enable Row Level Security (RLS)
- Configure appropriate policies
- Use environment variables for sensitive data
- Validate user inputs

### Frontend Security
- Sanitize user inputs
- Use HTTPS in production
- Implement proper error handling
- Secure API endpoints

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes with proper commit messages
3. Test thoroughly
4. Submit pull request
5. Code review and merge

### Code Standards
- Use ESLint configuration
- Follow React best practices
- Keep components small and focused
- Use TypeScript for type safety (future enhancement)

## 📞 Support

### Technical Issues
- Check browser console for errors
- Verify environment variables
- Ensure Supabase connection
- Review network requests

### Feature Requests
- Create GitHub issues
- Provide detailed descriptions
- Include mockups if applicable

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Core MVP functionality
- [x] Responsive design
- [x] Basic Supabase integration

### Phase 2 (Next)
- [ ] User authentication
- [ ] Real-time messaging
- [ ] Payment integration
- [ ] Advanced search filters

### Phase 3 (Future)
- [ ] Video calling integration
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Supabase for the backend infrastructure
- Framer Motion for smooth animations
- React Icons for consistent iconography

---

Built with ❤️ for connecting wizards and seekers worldwide.