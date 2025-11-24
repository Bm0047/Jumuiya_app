import os
from dotenv import load_dotenv
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# --- 1. CONFIGURATION ---
# IMPORTANT: Replace these with your actual PostgreSQL credentials
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")  # Assuming you are using the default 'postgres' database
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS") # <<< UPDATE THIS WITH YOUR PASSWORD
DB_PORT = os.getenv("DB_PORT")

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# --- 2. DATABASE CONNECTION FUNCTION ---
def get_db_connection():
    """Establishes and returns a PostgreSQL database connection."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        return conn
    except psycopg2.Error as e:
        # In a real app, you would log this error and return a generic server error
        print(f"Database connection failed: {e}")
        return None

# --- 3. FLASK ROUTE TO TEST CONNECTION AND RETRIEVE DATA ---
@app.route('/members', methods=['GET'])
def list_members():
    """
    Connects to the database and retrieves all members.
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Could not connect to database"}), 500

    try:
        cur = conn.cursor()
        
        # SQL Query to select all data from the members table
        cur.execute("SELECT member_id, family_name, age_group, role FROM members;")
        
        # Get column names for building the list of dictionaries
        column_names = [desc[0] for desc in cur.description]
        
        # Fetch all results
        members_data = cur.fetchall()
        
        # Convert results to a list of dictionaries for JSON output
        members_list = []
        for row in members_data:
            members_list.append(dict(zip(column_names, row)))
            
        return jsonify(members_list)

    except psycopg2.Error as e:
        print(f"Error executing query: {e}")
        return jsonify({"error": "Failed to retrieve data"}), 500
        
    finally:
        # Always ensure the connection is closed
        if conn:
            conn.close()


# --- 4. RUN THE APPLICATION ---
if __name__ == '__main__':
    # Before running, ensure you have Flask and psycopg2 installed:
    # pip install Flask psycopg2-binary
    
    print(f"--- Running Flask App. Connects to {DB_NAME} as {DB_USER} ---")
    app.run(debug=True, port=5000)
