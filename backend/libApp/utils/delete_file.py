import os
from django.conf import settings

def delete_file(path):
    if not path :
        return
    full_path = os.path.join(settings.MEDIA_ROOT,path)
    print(full_path)
    if os.path.exists(full_path):
        os.remove(full_path)