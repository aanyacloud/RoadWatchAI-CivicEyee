from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO

import os

app = Flask(__name__)

CORS(app)

# Load AI model
model = YOLO("RoadDamageDetector_v2.pt")

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

# Store latest result folder
latest_result_folder = ""


# DETECT ROUTE
@app.route('/detect', methods=['POST'])
def detect():

    global latest_result_folder

    file = request.files['image']

    image_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(image_path)

    # Run AI detection
    results = model.predict(
        source=image_path,
        conf=0.15,
        save=True
    )

    # EXACT save folder from YOLO
    latest_result_folder = str(
        results[0].save_dir
    )

    # Detect class
    boxes = results[0].boxes

    detected_class = "RoadDamage"

    if len(boxes) > 0:

        cls_id = int(boxes[0].cls[0])

        names = model.names

        detected_class = names[cls_id]

    return jsonify({

        "message": "Detection successful",

        "image":
        f"http://127.0.0.1:5000/result-image/{file.filename}",

        "detection": detected_class,

        "status": "Pending"

    })


# SERVE DETECTED IMAGE
@app.route('/result-image/<filename>')
def get_result_image(filename):

    global latest_result_folder

    return send_from_directory(
        latest_result_folder,
        filename
    )


if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,
        use_reloader=False
    )