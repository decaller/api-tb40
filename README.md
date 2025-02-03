# API TB40 (Tafsir Bakat 40)

API TB40 is a RESTful API service for calculating and analyzing the TB40 (Tafsir Bakat 40) personality assessment test. It provides endpoints for getting test questions and calculating test results, including detailed analysis and visual representations.

## Features

- Get TB40 test questions
- Calculate TB40 test results
- Generate visual representations (SVG) of results
- Support for multiple versions and test types
- Handlebars templating for dynamic result presentation
- Color coding based on scores and rankings

## Installation

### Using Docker (on development)

1. Pull the Docker image:
```bash
docker pull yourusername/api-tb40
```

2. Run the container:
```bash
docker run -p 4040:4040 yourusername/api-tb40
```

### Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/api-tb40.git
```

2. Install dependencies:
```bash
cd api-tb40
npm install
```

3. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:4040`

## API Documentation

### Get Test Questions

```bash
GET /api/v0.1/tb40/questions.json
```

Returns the 40 questions for the TB40 assessment.

### Calculate Results

```bash
POST /api/v0.1/tb40/calculation
```

Request body format:
```json
{
  "parts": {
    "umum": {
      "nama": {
        "lengkap": "Full Name",
        "panggilan": "Nick Name"
      },
      "lahir": {
        "tanggal": "YYYY-MM-DD"
      },
      "tanggal": "YYYY-MM-DD"
    },
    "tb40": [
      60,60,60,60,60, // Array of 40 scores between 0-100
      ...
    ]
  }
}
```

### Visual Representations

The API provides two SVG visualizations of the results:

- `tb40.svg` - Shows results colored by score
- `tb40byRank.svg` - Shows results colored by rank

## Test the API

Using curl:

```bash
curl -X POST http://localhost:3005/api/v0.1/tb40/calculation \
-H "Content-Type: application/json" \
-d '{
  "parts": {
    "umum": {
      "nama": {
        "lengkap": "John Doe",
        "panggilan": "John"
      },
      "lahir": {
        "tanggal": "1990-01-01"
      },
      "tanggal": "2024-01-01"
    },
    "tb40": [
      60,60,60,60,60,60,60,60,60,60,
      60,60,60,60,60,60,60,60,60,60,
      60,60,60,60,60,60,60,60,60,60,
      60,60,60,60,60,60,60,60,60,60
    ]
  }
}'
```

## Directory Structure

```
api-tb40/
├── api/
│   └── v0.1/
│       └── tb40/
│           ├── calculation.json
│           ├── questions.json
│           ├── tb40.svg
│           └── tb40byRank.svg
├── middleware/
│   ├── validateParams.js
│   └── validateRequestBody.js
├── routes/
│   └── index.js
├── services/
│   └── calculation.js
├── utils/
│   ├── coloring.js
│   └── templateRenderer.js
└── app.js
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
## Development

### TB40 Calculation Logic

To redevelop the TB40 calculation functionality for your own application:

1. Refer to `api/v0.1/tb40/calculation.json` for the scoring matrix and algorithms
2. Implement calculation logic in `services/calculation.js`:
   - Parse input scores array
   - Apply scoring matrix transformations
   - Calculate percentiles and ranks
   - Generate dimensional scores

### Handlebars Templates

The application uses Handlebars for dynamic rendering:

1. Color coding based on scores:
```javascript
// utils/coloring.js
const colorMap = {
  high: '#28a745',
  medium: '#ffc107',
  low: '#dc3545'
}
```

2. SVG templates in `views/`:
   - `tb40.hbs` - Base SVG template with score colors
   - `tb40byRank.hbs` - SVG template with rank-based coloring
   - Dynamic text injection for labels and values
   - Conditional classes for styling


## License

[ISC](https://choosealicense.com/licenses/isc/)
