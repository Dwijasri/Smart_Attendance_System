import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import face_recognition
import datetime
import cv2
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Paths
BASE_DIR = "C:/Users/Micro/OneDrive/Documents/3-2 notes/AD III-II"
ATTENDANCE_JSON_FILE = os.path.join(BASE_DIR, "attendance-system-frontend", "src", "attendance_data.json")
STUDENT_DATA_FILE = os.path.join(BASE_DIR, "attendance-system-frontend", "students.json")

# Ensure directories exist
if not os.path.exists(BASE_DIR):
    os.makedirs(BASE_DIR)

if not os.path.exists(os.path.join(BASE_DIR, "attendance-system-frontend")):
    os.makedirs(os.path.join(BASE_DIR, "attendance-system-frontend"))

# Helper function to load or create the student data file
def load_or_create_student_data():
    if os.path.exists(STUDENT_DATA_FILE):
        with open(STUDENT_DATA_FILE, "r") as f:
            return json.load(f)
    else:
        return {}

# Helper function to save student data to the JSON file
def save_student_data(student_data):
    with open(STUDENT_DATA_FILE, "w") as f:
        json.dump(student_data, f, indent=4)

# Helper function to load or create the attendance JSON file
def load_or_create_attendance_json():
    if os.path.exists(ATTENDANCE_JSON_FILE):
        with open(ATTENDANCE_JSON_FILE, "r") as f:
            return json.load(f)
    else:
        return []

# Helper function to save attendance data to the JSON file
def save_attendance_json(attendance_data):
    with open(ATTENDANCE_JSON_FILE, "w") as f:
        json.dump(attendance_data, f, indent=4)

# API endpoint to register a new student
@app.route("/api/register", methods=["POST"])
def register_student():
    try:
        data = request.json
        student_name = data.get("name")
        roll_number = data.get("roll_number")
        photos = data.get("photos")

        if not student_name or not roll_number or not photos or len(photos) < 5:
            return jsonify({"error": "Student name, roll number, and at least 5 photos are required"}), 400

        # Process photos and extract face encodings
        known_encodings = []
        for photo in photos:
            # Convert base64 to image
            img_data = base64.b64decode(photo.split(",")[1])
            img_array = np.frombuffer(img_data, dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

            # Extract face encodings
            face_encoding = face_recognition.face_encodings(img)
            if face_encoding:
                known_encodings.append(face_encoding[0])
            else:
                return jsonify({"error": "No face detected in one or more photos"}), 400

        if known_encodings:
            # Save face encodings to a .npy file
            encodings_file = os.path.join(BASE_DIR, f"{student_name}_encodings.npy")
            np.save(encodings_file, known_encodings)

            # Save student data to the JSON file
            student_data = load_or_create_student_data()
            student_data[student_name] = {
                "roll_number": roll_number,
                "encodings_file": encodings_file
            }
            save_student_data(student_data)

            return jsonify({"message": f"{student_name} registered successfully!"}), 200
        else:
            return jsonify({"error": "No face encodings were generated"}), 400

    except Exception as e:
        print(f"Error registering student: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# API endpoint to mark attendance
@app.route("/api/markattendance", methods=["POST"])
def mark_attendance():
    try:
        # Get the photo from the request
        data = request.json
        photo = data.get("photo")

        if not photo:
            return jsonify({"error": "Photo is required"}), 400

        # Convert base64 to image
        img_data = base64.b64decode(photo.split(",")[1])
        img_array = np.frombuffer(img_data, dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        # Extract face encodings from the photo
        face_encoding = face_recognition.face_encodings(img)
        if not face_encoding:
            return jsonify({"error": "No face detected in the photo"}), 400

        # Load student data
        student_data = load_or_create_student_data()
        if not student_data:
            return jsonify({"error": "No students registered"}), 400

        # Compare face encodings with registered students
        for student_name, details in student_data.items():
            encodings_file = details["encodings_file"]
            registered_encodings = np.load(encodings_file)

            # Compare faces
            matches = face_recognition.compare_faces(registered_encodings, face_encoding[0])
            if True in matches:
                # Load attendance data
                attendance_data = load_or_create_attendance_json()

                # Get current date
                now = datetime.datetime.now()
                date_str = now.strftime("%Y-%m-%d")

                # Find or create the student's attendance record
                student_record = None
                for record in attendance_data:
                    if record["name"] == student_name:
                        student_record = record
                        break

                if not student_record:
                    student_record = {
                        "name": student_name,
                        "roll_number": details["roll_number"]
                    }
                    attendance_data.append(student_record)

                # Mark attendance for the current date
                student_record[date_str] = "Present"

                # Save updated attendance data
                save_attendance_json(attendance_data)

                return jsonify({"message": f"Attendance marked for {student_name}"}), 200

        return jsonify({"error": "No matching student found"}), 400

    except Exception as e:
        print(f"Error marking attendance: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# API endpoint to view attendance
@app.route("/api/viewattendance", methods=["GET"])
def view_attendance():
    try:
        # Get query parameters
        student_name = request.args.get("name")
        roll_number = request.args.get("roll_number")

        if not student_name or not roll_number:
            return jsonify({"error": "Student name and roll number are required"}), 400

        # Load attendance data
        attendance_data = load_or_create_attendance_json()

        # Find the student's attendance record
        student_record = None
        for record in attendance_data:
            if record["name"] == student_name and record["roll_number"] == roll_number:
                student_record = record
                break

        if not student_record:
            return jsonify({"error": "No attendance records found for the student"}), 400

        # Return the attendance data
        return jsonify({
            "name": student_name,
            "roll_number": roll_number,
            "attendance": student_record
        }), 200

    except Exception as e:
        print(f"Error viewing attendance: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)