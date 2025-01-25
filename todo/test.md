# Creating Tests with Jest

This guide explains how to create tests for each file using Jest, a popular JavaScript testing framework.

## Project Structure

First, create a `__tests__` directory and separate test files for each module:

```plaintext
api-tb40/
├── __tests__/
│   ├── calculation.test.js
│   ├── coloring.test.js
│   └── templateRenderer.test.js
```

## Test Files

### `coloring.test.js`

```javascript
const { scoreToColor, rankToColor } = require('../utils/coloring');

describe('Coloring Utils', () => {
  describe('scoreToColor', () => {
    test('should return red color for score 0', () => {
      expect(scoreToColor(0)).toBe('#bf4040');
    });

    test('should return green color for score 50', () => {
      expect(scoreToColor(50)).toBe('#40bf40');
    });

    test('should return blue color for score 100', () => {
      expect(scoreToColor(100)).toBe('#4040bf');
    });

    test('should handle scores outside 0-100 range', () => {
      expect(scoreToColor(-10)).toBe('#bf4040');
      expect(scoreToColor(110)).toBe('#4040bf');
    });
  });

  describe('rankToColor', () => {
    test('should return appropriate colors based on rank and total', () => {
      expect(rankToColor(1, 10)).toBe('#4040bf'); // Top rank should be blue
      expect(rankToColor(10, 10)).toBe('#bf4040'); // Bottom rank should be red
    });
  });
});
```

### `templateRenderer.test.js`

```javascript
const renderTemplate = require('../utils/templateRenderer');

describe('Template Renderer', () => {
  test('should render simple template with data', () => {
    const template = 'Hello {{name}}!';
    const data = { name: 'World' };
    expect(renderTemplate(template, data)).toBe('Hello World!');
  });

  test('should render template with nested objects', () => {
    const template = '{{user.name}} is {{user.age}} years old';
    const data = { user: { name: 'John', age: 30 } };
    expect(renderTemplate(template, data)).toBe('John is 30 years old');
  });

  test('should render template with arrays using each', () => {
    const template = '{{#each items}}{{this}}{{/each}}';
    const data = { items: [1, 2, 3] };
    expect(renderTemplate(template, data)).toBe('123');
  });
});
```

### `calculation.test.js`

```javascript
const { handleCalculation } = require('../services/calculation');
const fs = require('fs');
const path = require('path');

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

describe('Calculation Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock JSON data
    const mockCalculationJson = {
      parts: {
        tb40: {
          pillars: [
            // Add mock pillar data
          ],
          groupLinage: [
            // Add mock group data
          ],
          result: {
            // Add mock result structure
          },
          presentation: {
            // Add mock presentation data
          }
        }
      }
    };

    // Setup fs mock
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCalculationJson));
  });

  test('should handle calculation request correctly', () => {
    const req = {
      params: {
        version: '1.0',
        type: 'test'
      },
      body: {
        parts: {
          umum: {},
          tb40: [/* mock tb40 scores */]
        }
      }
    };

    const result = handleCalculation(req);

    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('parts');
    // Add more specific expectations based on your implementation
  });

  test('should calculate scores correctly', () => {
    // Add test for score calculations
  });

  test('should sort and rank results correctly', () => {
    // Add test for sorting and ranking
  });
});
```

## Configuration

### Package.json Test Configuration

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "services/**/*.js",
      "utils/**/*.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Install Dependencies

```bash
npm install --save-dev jest @types/jest
```

## Additional Test Utilities

### Mock Data

```javascript
// __mocks__/testData.js
module.exports = {
  mockCalculationData: {
    // Add mock data structure
  },
  mockRequest: {
    // Add mock request structure
  }
};
```

### Test Helpers

```javascript
// __tests__/helpers/testHelpers.js
function createMockRequest(params = {}, body = {}) {
  return {
    params: {
      version: '1.0',
      type: 'test',
      ...params
    },
    body: {
      parts: {
        umum: {},
        tb40: [],
        ...body
      }
    }
  };
}

module.exports = {
  createMockRequest
};
```

### Integration Tests

```javascript
// __tests__/integration/calculation.integration.test.js
describe('Calculation Integration', () => {
  test('should process complete calculation flow', () => {
    // Test the complete flow with actual file reading
  });
});
```

## Testing Best Practices

- Write meaningful test descriptions
- Test both success and error cases
- Mock external dependencies
- Test edge cases
- Maintain high test coverage
- Use test fixtures for complex data
- Group related tests using describe blocks
- Use beforeEach and afterEach for setup and cleanup
