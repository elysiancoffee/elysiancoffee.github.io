from flask import Flask, request, redirect, url_for, render_template, send_from_directory
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

REPLIT_PROJECT_URL = f"https://images.elysiancoffers.repl.co"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part"
    files = request.files.getlist('file')
    uploaded_links = []
    for file in files:
        if file.filename == '':
            return redirect(url_for('home'))  # Redirect back to the home page if no file selected
        if file:
            if file.filename.endswith(('.psd', '.png', '.jpg', '.gif')):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                # Generate the image link using the project URL
                image_link = f"{REPLIT_PROJECT_URL}/images/{filename}"
                uploaded_links.append(image_link)
            else:
                return "Invalid file format. Supported formats: .psd, .png, .jpg, .gif"
    if uploaded_links:
        return f"Files successfully uploaded. {[f'{link}' for link in uploaded_links]}"
    else:
        return "No files uploaded"

@app.route('/images/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
