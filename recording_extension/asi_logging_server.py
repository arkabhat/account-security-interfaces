from flask import Flask, request, jsonify
import json 
app = Flask(__name__)
from PIL import Image
import base64
from io import BytesIO

user_interactions = [
    {'datetime':100000, "name": "tester", "class":"tester"}
]

user_images = []

asi_captures = []

@app.get('/user_interaction')
def get_user_interaction():
    return jsonify(user_interactions)

@app.post('/user_interaction')
def add_user_interaction():
    if request.is_json:
        interaction = request.get_json()
        if interaction['type'] == 'capture':
            img_data = interaction['image']
            starter = img_data.find(',')
            img_data = img_data[starter+1:]
            img_data = bytes(img_data, encoding='ascii')
            im = Image.open(BytesIO(base64.b64decode(img_data)))
            asi_captures.append((im, "{}_asi_screenshot.png".format(interaction['datetime'])))
            interaction.pop('image', None)

            user_interactions.append(interaction)
        elif interaction['type'] == 'click' and 'elementImage' in interaction.keys():
            img_data = interaction['elementImage']
            starter = img_data.find(',')
            img_data = img_data[starter+1:]
            img_data = bytes(img_data, encoding='ascii')
            im = Image.open(BytesIO(base64.b64decode(img_data)))
            user_images.append((im, "{}_{}_interaction_screenshot.png".format(interaction['datetime'], interaction['tagname'])))
            # Remove from json 
            interaction.pop('elementImage', None)
            
            user_interactions.append(interaction)
        elif interaction['type'] == 'fullPage' and 'pageImage' in interaction.keys():
            pg_img_data = interaction['pageImage']
            pg_starter = pg_img_data.find(',')
            pg_img_data = pg_img_data[pg_starter+1:]
            pg_img_data = bytes(pg_img_data, encoding='ascii')
            pg_im = Image.open(BytesIO(base64.b64decode(pg_img_data))) 
            user_images.append((pg_im, "{}_page_screenshot.png".format(interaction['datetime'])))
            

        return interaction, 200 
    return {"error": "Request must be JSON"}, 415

@app.post('/save_user_interaction')
def save_user_interaction():
    if request.is_json:
        dirpath = request.get_json()
        path = dirpath["dirpath"]
        with open("{}/json_dumps/user_interactions.json".format(path), 'w+') as f:
            json.dump(user_interactions, f)
        user_interactions.clear()

        # Save all images
        # dir = "".join(i + "/" for i in path.split("/")[:-1])
        for im in user_images:
            img, p = im 
            img.save("{}/screenshots/{}".format(path, p))

        user_images.clear()

        for im in asi_captures:
            img, p = im
            img.save("{}/screenshots/{}".format(path, p))

        asi_captures.clear()

        return dirpath, 200
    
    return {"error": "Request must be JSON"}, 415

