import flask
from flask import request, jsonify
from flask_cors import CORS
import uuid
import logging

# Initialize the Flask application
app = flask.Flask(__name__)

# Apply CORS to allow your frontend (running on a different port/origin) to connect.
# In a development environment, we allow all origins.
CORS(app)

# Set up logging for better visibility in the console
# This ensures data received is printed to the console when the server is running.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Triage Submission Endpoint ---
@app.route('/submit-triage', methods=['POST'])
def submit_triage():
    """
    Handles the asynchronous submission of patient triage data.
    
    This endpoint receives a JSON payload, generates a unique reference ID,
    logs the data, and simulates a successful response.
    """
    try:
        # Check if the request body is JSON
        if not request.is_json:
            logging.error("Request failed: Missing JSON payload.")
            return jsonify({"message": "Missing JSON payload in request"}), 400

        # Get the JSON data sent from the frontend script.js
        data = request.get_json()

        # Generate a unique reference ID for the consultation (8-character uppercase)
        reference_id = str(uuid.uuid4())[:8].upper()

        logging.info("--- Triage Data Received ---")
        logging.info(f"Ref ID: {reference_id}")
        logging.info(f"Patient Name: {data.get('patientName', 'N/A')}")
        logging.info(f"Age: {data.get('age', 'N/A')}")
        logging.info(f"Chief Complaint (Snippet): {data.get('chiefComplaint', 'N/A')[:50]}...")
        logging.info(f"Vitals: Temp={data.get('temperature')}, HR={data.get('heartRate')}, SpO2={data.get('spo2')}")
        # In a real application, you would save 'data' to a database (e.g., Firestore) here.
        logging.info("-----------------------------")

        # Simulate successful processing and return the reference ID
        return jsonify({
            "message": "Data received and consultation initiated.",
            "referenceId": reference_id
        }), 200

    except Exception as e:
        # Handle general server errors
        logging.error(f"An unexpected error occurred during submission: {e}", exc_info=True)
        return jsonify({"message": f"Internal Server Error: {str(e)}"}), 500

# To run the server directly
if __name__ == '__main__':
    # app.run() utilizes the Werkzeug development server, which is a WSGI server, 
    # making the application runnable for local testing.
    # The host and port match the frontend's fetch request (127.0.0.1:5000).
    app.run(host='127.0.0.1', port=5001, debug=True)
