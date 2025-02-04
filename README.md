# API TB40 (Tafsir Bakat 40)
API TB40 is a RESTful API service for calculating and analyzing the TB40 (Tafsir Bakat 40) personality assessment test. It provides endpoints for getting test questions and calculating test results, including detailed analysis and visual representations.

## Features
- Get TB40 test questions
- Calculate TB40 test results
- Generate visual representations (SVG) of results
- Support for multiple versions and test types
- Handlebars templating for dynamic result presentation
- Color coding based on scores and rankings

# Try now

Here's a `curl` example to test the API:

```bash
curl --request POST \
  --url http://tb40.insantaqwa.org/api/v0.1/tb40/calculation \
  --header 'Accept-Encoding: gzip' \
  --header 'Content-Type: application/json' \
  --data '{
         "parts": {
           "umum": {
             "nama": {
               "lengkap": "fulan"
             },
             "lahir": {
               "tanggal": "13-10-1992"
             },
             "tanggal": "13-5-2025"
           },
           "tb40": [60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100]
         }
       }'
```
Expected results are available in the linked [result.json](api/v0.1/tb40/result.json) file. The JSON response includes the following key sections:

*   **message**:  "Calculation for tb40 in version v0.1" - A general description of the result.
*   **parts**: The main container for all result data.
    *   **umum**: General information about the test subject.
        *   **nama**: Name details.
            *   **lengkap**: "fulan" - The full name.
            *   **panggilan**: "fulan" - The nickname.
        *   **lahir**: Birth information.
            *   **tanggal**: "13-10-1992" - The date of birth.
        *   **tanggal**: "13-5-2025" - The date of calculation.
    *   **tb40**: TB40-specific results, further broken down into:
        *   **tb40Result**: Raw results, grouped by category (2, 3, 6, 18, 40). Each category contains a list of items with the following properties:
            *   **name**: The name of the trait or attribute.
            *   **pillar**: `no`, `group` - Identifiers for the pillar.
            *   **data**: Detailed data for the trait, including: `arab` (Arabic term), `arti` (meaning), `definisi` (definition), learning style, and language preferences (where applicable). The data structure and content depend on the group.
            *   **score**: The calculated score for the trait.
            *   **rank**: The rank of the trait within its group.
        *   **tb40ResultRanked**: The same structure as `tb40Result`, but with each category's items already sorted by `rank`.
        *   **tb40Presentation**: Summarized and presentable information.
            *   **definisi\_tb40**: Definition of the TB40 assessment.
                *   **title**: "Definisi TB40"
                *   **data**: Text defining TB40.
            *   **definisi\_bakat**: Definition of "bakat" (talent).
                *   **title**: "Definisi Bakat"
                *   **data**: Text defining "bakat".
            *   **julukan**: A nickname derived from the results.
                *   **title**: "julukan"
                *   **data**: Example: "Berperasaan yang Pekerja Keras"
            *   **kepribadian**: A summary of the personality type.
                *   **title**: "kepribadian"
                *   **data**:  A textual summary.
            *   **ringkasan\_gaya\_belajar**:  Summary of learning style preferences.
                *   **title**: "Ringkasan Gaya Belajar"
                *   **data**: A textual summary.
            *   **ringkasan\_bahasa\_hati**: Summary of "language of the heart" preferences.
                *   **title**: "Ringkasan Bahasa Hati"
                *   **data**: A textual summary.
            *   **pemetaan\_tafsir\_bakat**:  Talent interpretation mapping visualization (SVG).
                *   **title**: "Pemetaan Tafsir Bakat"
                *   **file**:  A large XML string representing an SVG image.
             *   **pemetaan\_tafsir\_bakat\_byRank**: Talent interpretation mapping visualization (SVG), ranked.
                *   **title**: "Pemetaan Tafsir Bakat"
                *   **file**:  A large XML string representing an SVG image, visualized by rank.
                curl --request POST \
                  --url http://tb40.insantaqwa.org/api/v0.1/tb40/calculation \
                  --header 'Accept-Encoding: gzip' \
                  --header 'Content-Type: application/json' \
                  --data '{
                         "parts": {
                           "umum": {
                             "nama": {
                               "lengkap": "fulan"
                             },
                             "lahir": {
                               "tanggal": "13-10-1992"
                             },
                             "tanggal": "13-5-2025"
                           },
                           "tb40": [60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100]
                         }
                       }'

## Installation
### Using Docker (from main branch)

1.  Pull the Docker image from GitHub Container Registry:

    ```bash
    docker pull ghcr.io/decaller/api-tb40:latest
    ```

2.  Run the container:

    ```bash
    docker run -p 4040:4040 ghcr.io/decaller/api-tb40:latest
    ```


### Manual Installation

1. Clone the repository:
```bash

git clone https://github.com/decaller/api-tb40.git

git clone https://github.com/decaller/api-tb40.git

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

## Test the Local API

Using curl:

```bash
curl --request POST \
  --url http://localhost:4040/api/v0.1/tb40/calculation \
  --header 'Accept-Encoding: gzip' \
  --header 'Content-Type: application/json' \
  --data '{
         "parts": {
           "umum": {
             "nama": {
               "lengkap": "fulan"
             },
             "lahir": {
               "tanggal": "13-10-1992"
             },
             "tanggal": "13-5-2025"
           },
           "tb40": [60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100]
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
