from django.urls import path
from .views import BookAPIView, DecksAPIView, HabitProgressAPIView, HabitAPIView, TaskAPIView, KarmaAPIView, BirthdayAPIView, SettingsAPIView, CardsAPIView, CatalogueAPIView

urlpatterns = [
    path('book/', BookAPIView.as_view(), name='book'),
    path('book/<id>/', BookAPIView.as_view(), name='book_update'),
    path('habit/progress/', HabitProgressAPIView.as_view(), name='habit_progress'),
    path('habit/', HabitAPIView.as_view(), name='habit'),
    path('habit/update/', HabitProgressAPIView.as_view(), name='habit_update'),
    path('task/',TaskAPIView.as_view(), name='task'),
    path('task/<id>/',TaskAPIView.as_view(), name='task_delete'),
    path('karma/', KarmaAPIView.as_view(), name='karma'),
    path('birthday/', BirthdayAPIView.as_view(), name='birthday'),
    path('settings/', SettingsAPIView.as_view(), name='settings'),
    path('cards/', CardsAPIView.as_view(), name='cards'),
    path('decks/', DecksAPIView.as_view(), name='decks'),
    path('catalogue/', CatalogueAPIView.as_view(), name='catalogue'),

]
