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

2. View screenshot.png:

If crawler processes successfully, you can find file `screenshot.png` in root folder. It contains a screenshot of final page where barcode is located. The script is set to generate screenshot of final page, but it might be modifiend to fetch the barcode and send it to appropriate service.

## Description

- **credentials.js**: Stores the email and password.
- **crawler.js**: The main script that uses Puppeteer to emulate an iPhone, navigate to a specified URL.

## Notes

- Ensure your credentials are correct in the `credentials.js` file.
- Adjust the URL and selectors in `crawler.js` as needed for your specific use case.
- The sciprt is set to open browser to demonstrate all operations. If you need to avoid it, please change `headless` to `false` on line 50 of `crawler.js`

## License

This project is licensed under the MIT License.
