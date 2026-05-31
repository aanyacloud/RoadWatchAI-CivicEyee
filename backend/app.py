from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)

# Load trained model
model = YOLO("RoadDamageDetector_v2.pt")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/detect', methods=['POST'])
def detect():

    file = request.files['image']

    image_path = os.path.join(UPLOAD_FOLDER, file.filename)

    file.save(image_path)

    # Run AI prediction
    results = model.predict(
        source=image_path,
        conf=0.15,
        save=True
    )

    save_dir = results[0].save_dir

    detected_image = os.path.join(save_dir, file.filename)

    return jsonify({
        "message": "Detection successful",
        "image": detected_image
    })

if __name__ == '__main__':
    app.run(debug=True)