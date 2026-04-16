import os
from django.conf import settings
from uuid import uuid4

def save_file (file,folder):
    # folder = folder.strip("/\\")
    folder_path = os.path.join(settings.MEDIA_ROOT,folder)
    os.makedirs(folder_path,exist_ok=True)

    ext = file.name.split('.')[-1]
    filename = f"{uuid4()}.{ext}"

    file_path = os.path.join(folder_path, filename)

    with open(file_path,"wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)

    return f"{folder}/{filename}"