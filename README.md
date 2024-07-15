# Puppeteer iPhone Emulation Project

This project uses Puppeteer to emulate an iPhone device, navigate to a specific URL and fetch a barcode details, performing actions like solving CAPTCHAs.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```sh
   git clone git@github.com:hinkoulabs/ticket_crawler.git
   cd ticket_crawler
```

2. Install the dependencies:

```sh
   npm install
```

## Configuration

1. Create credentials into a `credentials.js` file in the root of your project:

```javascript
// credentials.js
const credentials = {
    email: "EMAIL",
    password: "PASSWORD"
}

export default credentials;
```

## Usage

1. Run the script:

```sh
node crawler.js
```

## Description

- **credentials.js**: Stores the email and password.
- **crawler.js**: The main script that uses Puppeteer to emulate an iPhone, navigate to a specified URL.

## Notes

- Ensure your credentials are correct in the `credentials.js` file.
- Adjust the URL and selectors in `crawler.js` as needed for your specific use case.

## License

This project is licensed under the MIT License.
