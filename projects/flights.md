# Flight Search Project

## Objective
Develop an intelligent flight search system that optimizes multi-leg journeys with specific constraints and preferences, leveraging LLMs for complex decision-making.

## Core Features

### 1. Traveler Profiles
- **Parents**: Prefer routes like EUG -> ORD -> SBN, with constraints on layover time and accessibility.
- **Family with Nora**: Prefer routes like PDX -> ORD/MDW, with specific departure and arrival time ranges.

### 2. Transit Integration
- Integrate South Shore train schedules for flights to/from ORD.
- Highlight flights that align well with train schedules, considering buffer times for airport transfers.

### 3. LLM Integration
- Use LLMs for natural language processing of user preferences and constraints.
- Provide complex decision-making for route optimization, considering factors like cost vs. time.
- Generate explanations for flight recommendations, stored in SQLite for reference.

### 4. Data Storage
- Use SQLite for local caching of flight data, conversation history, and rejected suggestions.
- Store LLM reasoning and explanations for flight selections.

## User Interface
- Chat interface with current settings displayed at the top.
- Suggestion UI for parameter changes with visual diffs, allowing users to accept or reject changes.
- Display cached flight results with explanations and indicators for train schedule alignment.

## Development Steps

1. **Traveler Profiles**: Implement data structures for storing user preferences.
2. **Transit Integration**: Integrate train schedules and highlight aligned flights.
3. **LLM Integration**: Connect to LLM for processing and decision-making.
4. **Data Storage**: Set up SQLite for caching and storing explanations.
5. **User Interface**: Build chat interface and suggestion UI.

## API Integration
- Use SerpAPI's Google Flights endpoint for flight data retrieval.

## Considerations
- Ensure scalability for handling large datasets.
- Maintain flexibility for adding new traveler profiles and preferences.
- Optimize performance for real-time user interactions.

## Code References
- **Traveler Profiles**: 
  ```markdown:projects/flights.md
  startLine: 15
  endLine: 39
  ```
- **Flight Search Form**: 
  ```javascript:ui/views/flights-container.js
  startLine: 1
  endLine: 120
  ```
- **Flight Data Types**: 
  ```typescript:types.d.ts
  startLine: 132
  endLine: 199
  ```

## Next Steps
- Implement SQLite storage schema.
- Build initial chat interface.
- Integrate LLM for natural language processing.
- Add South Shore train schedule integration.
- Develop traveler profile management.