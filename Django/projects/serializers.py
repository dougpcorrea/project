from rest_framework import serializers
from .models import Book, Decks, Habit, HabitProgress, Task, Karma, Birthday, Settings, Cards

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'

class HabitProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitProgress
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class KarmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Karma
        fields = '__all__'

class BirthdaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Birthday
        fields = '__all__'

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'

class CardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cards
        fields = '__all__'

class DecksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Decks
        fields = '__all__'
