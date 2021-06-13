from __future__ import unicode_literals
from bottle import Bottle, request, response, BaseRequest
import cv2
from fer import FER
from urllib.request import urlopen
import numpy as np
import base64

BaseRequest.MEMFILE_MAX = 1024 * 1024

app = Bottle()


detector = FER(mtcnn=True)


template = """
<html>
    <head><title>Home</title></head>
    <body>
        <h1>Upload a file</h1>
        <form method="POST" enctype="multipart/form-data" action="/upload">
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
    req_file = request.files['file']
    file = req_file.file.read()
    image = cv2.imdecode(np.fromstring(file, np.uint8), cv2.IMREAD_COLOR)
    result = detector.detect_emotions(image)
    print(result)
    emotions = {'angry': 0, 'disgust': 0, 'fear': 0,
                'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0}
    if len(result) > 0:
        bounding_box = result[0]["box"]
        emotions = result[0]["emotions"]
        cv2.rectangle(
            image,
            (bounding_box[0], bounding_box[1]),
            (bounding_box[0] + bounding_box[2],
             bounding_box[1] + bounding_box[3]),
            (0, 155, 255),
            2,
        )
        image = cv2.flip(image, 1)

    print(emotions)

    retval, buffer = cv2.imencode('.jpg', image)
    imgBase64 = base64.b64encode(buffer)
    return {
        "img": 'data:image/jpeg;base64, '+imgBase64.decode('utf-8'),
        "emotions": emotions
    }


if __name__ == "__main__":
    app.run(debug=True)

    # cam = cv2.VideoCapture(0)

    # cv2.namedWindow("test")

    # img_counter = 0

    # while True:
    #     ret, frame = cam.read()
    #     if not ret:
    #         print("failed to grab frame")
    #         break
    #     result = detector.detect_emotions(frame)
    #     if len(result) > 0:
    #         bounding_box = result[0]["box"]
    #         emotions = result[0]["emotions"]
    #         cv2.rectangle(
    #             frame,
    #             (bounding_box[0], bounding_box[1]),
    #             (bounding_box[0] + bounding_box[2],
    #              bounding_box[1] + bounding_box[3]),
    #             (0, 155, 255),
    #             2,
    #         )
    #     cv2.imshow("test", frame)

    #     k = cv2.waitKey(1)
    #     if k % 256 == 27:
    #         # ESC pressed
    #         print("Escape hit, closing...")
    #         break
    #     elif k % 256 == 32:
    #         # SPACE pressed
    #         img_name = "opencv_frame_{}.png".format(img_counter)
    #         cv2.imwrite(img_name, frame)
    #         print("{} written!".format(img_name))
    #         img_counter += 1

    # cam.release()

    # cv2.destroyAllWindows()
