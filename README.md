# FastAPI Application

This is a simple FastAPI application that demonstrates the structure and functionality of a typical FastAPI project.

## Project Structure

```
fastapi-app
├── app
│   ├── main.py         # Entry point of the FastAPI application
│   ├── models.py       # Data models used in the application
│   ├── schemas.py      # Pydantic schemas for request and response validation
│   └── utils.py        # Utility functions for common operations
├── requirements.txt     # List of dependencies for the application
├── cert.pem            # SSL certificate for HTTPS (generated)
├── key.pem             # SSL private key for HTTPS (generated)
└── README.md            # Documentation for the project
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd fastapi-app
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Generate SSL certificates for HTTPS (development only):
   ```
   openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
   ```
   When prompted for the Common Name (CN), enter `localhost` or `127.0.0.1`.

## Usage

To run the FastAPI application with HTTPS support, execute the following command:

```
uvicorn main:app --reload --port 8002 --ssl-keyfile=key.pem --ssl-certfile=cert.pem
```

You can then access the application at `https://127.0.0.1:8002`.

**Note:** Since we're using self-signed certificates for development, your browser may show a security warning. You can safely proceed by clicking "Advanced" and then "Proceed to 127.0.0.1 (unsafe)" or similar option in your browser.

## API Documentation

The automatically generated API documentation can be accessed at:

- Swagger UI: `https://127.0.0.1:8002/docs`
- ReDoc: `https://127.0.0.1:8002/redoc`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.