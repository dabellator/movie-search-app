# Movie Search Application

A modern React-based movie search application with AI-powered recommendations, built with TypeScript, Vite, and Tailwind CSS.

## Core Features

### Required Implementation
- ✅ **Searchable Interface** - Full-text search with debouncing and error handling
- ✅ **Genre Filtering** - Filter results by movie genre with clickable genre badges
- ✅ **Pagination** - Navigate through search results with Previous/Next controls
- ✅ **Result Count** - Accurate total count of search results across all pages
- ✅ **Movie Details** - Display comprehensive information (poster, rating, duration, cast, director, summary)
- ✅ **Individual Movie Pages** - Dedicated URLs for each film with full details

### Additional Features
- 🎯 **System Status Page** - Real-time API health monitoring for Movies API and AI services
- 🎨 **Grid/List View Toggle** - User preference for viewing search results
- 📊 **Activity Tracking** - Zustand-powered tracking of searches, genre filters, and movie views
- 🤖 **AI Recommendations** - OpenAI integration for personalized movie suggestions based on user activity

## Technical Highlights

### What I'm Most Proud Of

The project demonstrates a **cohesive, production-ready architecture** that balances functionality with maintainability. I'm particularly pleased with:

1. **User Activity Tracking System** - Built a complete event-driven tracking system using Zustand with localStorage persistence and automatic pruning. While rudimentary, it provides a solid foundation for analytics and personalization features.

2. **View Mode Implementation** - The grid/list toggle showcases thoughtful component separation using a container/presentation pattern. The `MovieCard` handles shared logic while delegating rendering to `MovieCardGrid` and `MovieCardList` components.

3. **Overall Architecture** - The codebase feels complete and extensible. Custom hooks, utility functions, and reusable components create a maintainable foundation for future features.

### Technical Decision Making

**Accurate Result Counting**  
The GraphQL API doesn't provide a total count field, which initially meant choosing between estimates or exact counts. I implemented a solution that fetches the last page to calculate the precise total: `(totalPages - 1) × perPage + lastPageCount`. This ensures users always see accurate result numbers.

**State Management Choice**  
I chose **urql** over Apollo (which I've used extensively) to work with a lighter-weight GraphQL client. This decision let me explore a different approach to data fetching while maintaining clean separation of concerns. For local state, I implemented Zustand specifically for activity tracking, demonstrating multiple state management patterns in one codebase.

**AI Integration Compromise**  
The AI recommendations feature faces a constraint: the AI doesn't know the limited movie database. Fetching all films to send as context felt excessive, so I implemented a prompt-based approach where the AI suggests titles that are then searched in the database. While not perfect, it balances functionality with reasonable API usage.

## Implementation Notes

### Component Architecture
- **Custom Hooks** - Encapsulate complex logic (`useDebounce`, `useAIRecommendations`, `useTotalResults`, `useSearchTracking`)
- **Utility Functions** - DRY principle applied to routing, formatting, and data helpers
- **Reusable Components** - Consistent UI through `Card`, `ErrorDisplay`, `LoadingSpinner`, etc.
- **Type Safety** - Comprehensive TypeScript interfaces for all data structures

### State & Data Flow
- URL-driven state management for search, genre, and pagination
- Debounced search input (1000ms) with immediate fetch on Enter key
- Bidirectional sync between URL params and component state
- Persistent user activity tracking with auto-pruning (30 days retention)

### Development Approach
This project was built with **AI assistance (Cursor/Claude)** to maximize productivity and code quality within a limited timeframe. AI served as a development accelerator, helping to:
- Maintain consistency across a growing codebase
- Rapidly implement and refactor features
- Explore alternative approaches to technical challenges
- Ensure best practices in component architecture

The core design decisions, architecture, and feature implementations reflect my own technical judgment and experience.

## Future Improvements

**Enhanced AI Experience**  
Given more time, I'd improve the AI recommendations by building a smarter context system. Options include creating a cached film taxonomy or implementing a semantic search layer to better match AI suggestions with database entries.

**Backend Service Layer**  
I originally considered building a custom backend to:
- Aggregate and enhance the movie database
- Add detailed director and actor information
- Implement proper recommendation algorithms
- Cache and optimize API responses

This felt outside the scope of the exercise but would significantly enhance the application's capabilities.

**Additional Features**
- User accounts and saved preferences
- Watchlists and favorites
- Advanced filtering (year, rating, duration)
- Recommendation refinement based on explicit user feedback

## Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API key (for AI recommendations feature)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_OPENAI_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 18** + **TypeScript** - UI framework and type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first styling
- **urql** - Lightweight GraphQL client
- **Zustand** - Minimal state management
- **React Router** - Client-side routing
- **OpenAI API** - AI-powered recommendations

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Route-level components
├── hooks/           # Custom React hooks
├── services/        # External API integration
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── utils/           # Helper functions and constants
└── graphql/         # GraphQL queries and schemas
```

## License

MIT License - See LICENSE file for details
