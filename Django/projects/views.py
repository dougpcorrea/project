import os
import requests
import random
from PIL import Image
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from .models import Book, Decks, Habit, HabitProgress, Karma, Task, Birthday, Settings, Cards
from .serializers import BookSerializer, DecksSerializer, HabitSerializer, HabitProgressSerializer, TaskSerializer, KarmaSerializer, BirthdaySerializer, SettingsSerializer, CardsSerializer

class BookAPIView(APIView):
    def get(self, request):
        queryset = Book.objects.all()
        serializer = BookSerializer(queryset, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        book = Book.objects.get(id=id)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(duration=request.data.get('duration'))
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class HabitAPIView(APIView):
    def get(self, request):
        queryset = Habit.objects.all()
        serializer = HabitSerializer(queryset, many=True)
        return Response(serializer.data)


class HabitProgressAPIView(APIView):
    def get(self, request):
        queryset = HabitProgress.objects.all()
        serializer = HabitProgressSerializer(queryset, many=True)
        return Response(serializer.data)

    def put(self, request):
        habit = request.data.get('habit')
        date = request.data.get('date')

        try:
            entry = HabitProgress.objects.get(habit=habit, date=date)
            serializer = HabitProgressSerializer(entry, data=request.data, partial=True)
        except ObjectDoesNotExist:
            serializer = HabitProgressSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(completed=request.data.get('completed'))
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class TaskAPIView(APIView):
    def get(self, request):
        queryset = Task.objects.all()
        serializer = TaskSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        existing_data = Task.objects.filter(id=data['id']).first()
        if existing_data:
            serializer = TaskSerializer(existing_data, data=data)
        else:
            serializer = TaskSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, id):

        entry = Task.objects.get(id=id)
        serializer = TaskSerializer(entry, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(completed=request.data.get('completed'))
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        try:
            entry = Task.objects.get(id=id)
            entry.delete()
            return Response(status=204)
        except Task.DoesNotExist:
            return Response(status=500)


class KarmaAPIView(APIView):
    def get(self, request):
        queryset = Karma.objects.all()
        serializer = KarmaSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        existing_data = Karma.objects.filter(date=data['date']).first()
        if existing_data:
            serializer = KarmaSerializer(existing_data, data=data)
        else:
            serializer = KarmaSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class BirthdayAPIView(APIView):
    def get(self, request):
        queryset = Birthday.objects.all()
        serializer = BirthdaySerializer(queryset, many=True)
        return Response(serializer.data)

class SettingsAPIView(APIView):
    def get(self, request):
        where_condition = request.query_params
        queryset = Settings.objects.all()

        if where_condition:
            setting = where_condition.get('setting')
            if setting:
                queryset = queryset.filter(Q(setting__icontains=setting))

        serializer = SettingsSerializer(queryset, many=True)
        return Response(serializer.data)

    def put(self, request):
        data=request.data

        entry = Settings.objects.get(setting=data.get('setting'))
        serializer = SettingsSerializer(entry, data=data, partial=True)

        if serializer.is_valid():
            serializer.save(value=request.data.get('value'))
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class CardsAPIView(APIView):
    def get(self, request):
        queryset = Cards.objects.all()
        serializer = CardsSerializer(queryset, many=True)
        return Response(serializer.data)

    def put(self, request):
        data = request.data
        entry = Cards.objects.get(id=data.get('id'))

        # Update 'back_one' image
        if data['url_one'] != '' and data['back_one'] != entry.back_one:
            file_type = data['filetype_one']
            filename = str(random.randint(100000000, 999999999)) + '.' + file_type
            back_one = '<img>' + filename            
            new_filepath = os.path.abspath(os.path.join(os.getcwd(), '..', '..', '..', 'Project', 'Angular', 'src', 'assets', 'cards', filename))

            if download_image(data['url_one'], filename, new_filepath):
                resize_image(new_filepath, (640, 480))
                data['back_one'] = back_one 
                try:
                    old_filepath = os.path.abspath(os.path.join(os.getcwd(), '..', '..', '..', 'Project', 'Angular', 'src', 'assets', 'cards', entry.back_one.split('<img>')[1]))
                    delete_image(old_filepath)
                    print(3)
                except:
                    pass
            else:
                return Response('URL_INVALIDO')

        # Update 'back_two' image
        if data['url_two'] != '' and data['back_two'] != entry.back_two:
            file_type = data['filetype_two']
            filename = str(random.randint(100000000, 999999999)) + '.' + file_type
            back_two = '<img>' + filename            
            new_filepath = os.path.abspath(os.path.join(os.getcwd(), '..', '..', '..', 'Project', 'Angular', 'src', 'assets', 'cards', filename))

            if download_image(data['url_two'], filename, new_filepath):
                resize_image(new_filepath, (640, 480))
                data['back_two'] = back_two 
                try:
                    old_filepath = os.path.abspath(os.path.join(os.getcwd(), '..', '..', '..', 'Project', 'Angular', 'src', 'assets', 'cards', entry.back_two.split('<img>')[1]))
                    delete_image(old_filepath)
                except:
                    pass
            else:
                return Response(status=500)

        # Update 'back_three' image
        if data['url_three'] != '' and data['back_three'] != entry.back_three:
            file_type = data['filetype_three']
            filename = str(random.randint(100000000, 999999999)) + '.' + file_type
            back_three = '<img>' + filename            
            new_filepath = os.path.abspath(os.path.join(os.getcwd(), '..', '..', '..', 'Project', 'Angular', 'src', 'assets', 'cards', filename))

            if download_image(data['url_three'], filename, new_filepath):
                resize_image(new_filepath, (640, 480))
                data['back_three'] = back_three 
                try:
                    old_filepath = os.path.abspath(os.path.join(os.getcwd(), '..', '..', '..', 'Project', 'Angular', 'src', 'assets', 'cards', entry.back_three.split('<img>')[1]))
                    delete_image(old_filepath)
                except:
                    pass
            else:
                return Response(status=500)
            
        serializer = CardsSerializer(entry, data=data, partial=True)

        if serializer.is_valid():
            serializer.save(id=request.data.get('id'))
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class DecksAPIView(APIView):
    def get(self, request):
        queryset = Decks.objects.all()
        serializer = DecksSerializer(queryset, many=True)
        return Response(serializer.data)


def download_image(url, filename, filepath):
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(filepath, 'wb') as file:
            file.write(response.content)
        return filename
    except:
        return None

def delete_image(file_path):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except:
        pass

def resize_image(image_path, target_size):
    try:
        image = Image.open(image_path)
        resized_image = image.resize(target_size, Image.ANTIALIAS)
        resized_image.save(image_path)
        return image_path
    except:
        return None