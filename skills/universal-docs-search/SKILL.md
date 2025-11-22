---
name: universal-docs-search
description: Universal technical documentation search using Context7 API. This skill should be used when users need to search for any programming language documentation, API references, framework guides, libraries, or technical tutorials across the entire technology ecosystem.
license: Complete terms in LICENSE.txt
---

# Universal Technical Documentation Search

This skill provides comprehensive technical documentation search capabilities using the Context7 API, supporting all programming languages, frameworks, libraries, and technologies.

## Purpose

Enable efficient searching of technical documentation across the entire technology landscape, including programming languages, frameworks, libraries, tools, platforms, and any technical resources available through Context7.

## When to Use

- Search any programming language documentation (Java, Python, JavaScript, Go, Rust, C++, Ruby, PHP, etc.)
- Find framework and library documentation (React, Spring, Django, Rails, Express, Flask, Angular, Vue.js, etc.)
- Look up API references for any technology stack or service
- Research technical implementation details for any platform or tool
- Find code examples and best practices across all technologies
- Search DevOps tools, cloud platforms, databases, and infrastructure documentation
- Find tutorials and guides for any programming concept, library, or tool
- Look up configuration guides for any development tool or platform

## Core Functionality

### Primary Search Methods

1. **Universal Documentation Search**
   - Use `/api/v1/search?query=<encoded-query>` endpoint
   - Supports keyword-based searching across all available documentation
   - Works with any programming language, framework, or technology
   - Encode search queries using URL encoding

2. **Project-Specific Documentation**
   - Use `/api/v1/{category}/{project-name}` for specific project categories
   - Access detailed documentation for any supported technology
   - Categories may include: spring-projects, javascript-libraries, python-packages, etc.
   - Direct navigation to project-specific resources

### Search Workflow

1. **Parse User Query**
   - Extract key technical terms and frameworks
   - Identify search intent (API reference, tutorial, guide)
   - Determine optimal search keywords

2. **Execute Search**
   - Construct appropriate API endpoint URL
   - Apply proper URL encoding for search terms
   - Execute HTTP GET request to Context7 API

3. **Process Results**
   - Parse JSON response from API
   - Extract relevant documentation links and descriptions
   - Organize results by relevance and category

4. **Format Output**
   - Present search results in structured format
   - Include direct links to documentation
   - Provide brief descriptions for each result
   - Highlight most relevant matches

### API Integration Details

Use the bundled API client script at `scripts/context7_client.py` for:

- Standardized API communication
- Error handling and retry logic
- Response parsing and validation
- Rate limiting compliance

### Supported Search Patterns

- **Programming Language Documentation**: `java 8 features`, `python 3.10 tutorial`, `javascript es6`, `go generics`, `rust ownership`
- **Framework and Libraries**: `react hooks tutorial`, `spring boot configuration`, `django models`, `express middleware`, `vue composition api`
- **API Reference**: `aws s3 api`, `github rest api`, `docker compose commands`, `git workflow commands`, `npm package management`
- **Tutorial Searches**: `how to install kubernetes`, `nodejs microservices tutorial`, `rust web development`, `flutter mobile app tutorial`
- **Best Practices**: `clean code principles`, `api design best practices`, `database optimization`, `security best practices`, `testing strategies`
- **DevOps and Infrastructure**: `docker containerization`, `kubernetes deployment`, `ci/cd pipeline`, `aws lambda functions`, `terraform infrastructure`
- **Database and Data**: `postgresql indexing`, `mongodb aggregation`, `redis caching`, `elasticsearch queries`, `pandas data analysis`
- **Development Tools**: `vscode extensions`, `intellij shortcuts`, `git hooks`, `webpack configuration`, `babel transpilation`

### Error Handling

- Handle API timeouts gracefully
- Provide alternative search suggestions for failed queries
- Inform users about search result limitations
- Suggest refining search terms for better results

## Resource Usage

### Scripts
- `scripts/context7-client.js` - JavaScript API client for Context7 integration
- `scripts/search-formatter.js` - Result formatting and categorization

### References
- `references/supported-technologies.md` - Comprehensive list of supported programming languages, frameworks, and technologies
- `references/search-examples.md` - Universal search patterns and examples across all technologies
- `references/api-limits.md` - API rate limits and usage guidelines