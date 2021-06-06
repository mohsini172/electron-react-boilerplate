from __future__ import unicode_literals
from bottle import Bottle, request, response
import cv2
from fer import FER
from urllib.request import urlopen
import numpy as np


# http://www.reddit.com/r/learnpython/comments/1037g5/whats_the_best_lightweight_web_framework_for/
# http://bottlepy.org/docs/dev/tutorial.html
app = Bottle()
detector = FER(mtcnn=True)


template = """<html>
<head><title>Home</title></head>
<body>
<h1>Upload a file</h1>
<form method="POST" enctype="multipart/form-data" action="/upload">
<label>Level:</label> <input type="text" name="level" value="42"><br>
<input type="file" name="picture" /><br>
<input type="submit" value="Submit" />
</form>
</body>
</html>"""


@app.get('/')
def home():
    return template


@app.post('/upload')
def upload():
    # A file-like object open for reading.
    req_file = request.files['picture']
    file = req_file.file.read()
    image = cv2.imdecode(np.fromstring(file, np.uint8), cv2.IMREAD_COLOR)
    result = detector.detect_emotions(image)
    print(result)
    bounding_box = result[0]["box"]
    emotions = result[0]["emotions"]

    cv2.rectangle(
        image,
        (bounding_box[0], bounding_box[1]),
        (bounding_box[0] + bounding_box[2], bounding_box[1] + bounding_box[3]),
        (0, 155, 255),
        2,
    )
    print(emotions)
    # cv2.imshow('', image)
    cv2.imwrite("porcessed image.jpg", image)
    print("Here")
    # Return a file-like object.
    return "Uploaded"


if __name__ == "__main__":
    app.run(debug=True)
