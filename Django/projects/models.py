from django.db import models

class Book(models.Model):
    id = models.BigIntegerField(primary_key=True)
    title = models.CharField(max_length=360)
    autor = models.CharField(max_length=360)
    filename = models.CharField(max_length=360)
    duration = models.DecimalField(max_digits=20, decimal_places=6)
    cover = models.CharField(max_length=360)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'hs_books'

class Habit(models.Model):
    id = models.BigIntegerField(primary_key=True)
    habit = models.CharField(max_length=100)    

    def __str__(self):
        return self.habit

    class Meta:
        db_table = 'hs_habits'

class HabitProgress(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE)
    completed = models.BigIntegerField(default=0)

    def __str__(self):
        return self.habit

    class Meta:
        db_table = 'hs_habits_progress'

class Task(models.Model):
    id = models.BigIntegerField(primary_key=True)
    task = models.CharField(max_length=500)
    date = models.DateField(null=True)
    priority = models.SmallIntegerField(null=True)
    ordering = models.SmallIntegerField(default=0)
    project = models.CharField(max_length=64, null=True)
    status = models.SmallIntegerField()
    subtask = models.BigIntegerField()
    repeat = models.SmallIntegerField()

    def __str__(self):
        return self.task

    class Meta:
        db_table = 'hs_tasks'

class Karma(models.Model):
    date = models.DateField(primary_key=True)
    completed = models.SmallIntegerField()

    def __str__(self):
        return self.completed

    class Meta:
        db_table = 'hs_karma'

class Birthday(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    date = models.DateField()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'hs_birthday'

class Settings(models.Model):
    id = models.AutoField(primary_key=True)
    setting = models.CharField(max_length=255)
    value = models.SmallIntegerField()

    def __str__(self):
        return self.setting

    class Meta:
        db_table = 'hs_settings'

class Cards(models.Model):
    id = models.AutoField(primary_key=True)
    front = models.CharField(max_length=150)
    back_one = models.CharField(max_length=150, blank=True, null=True)
    back_two = models.CharField(max_length=150, blank=True, null=True)
    back_three = models.CharField(max_length=150, blank=True, null=True)
    date = models.DateTimeField()
    times = models.SmallIntegerField()
    deck = models.CharField(max_length=255) 

    def __str__(self):
        return self.front

    class Meta:
        db_table = 'hs_cards'

class Decks(models.Model):
    id = models.AutoField(primary_key=True)
    deck = models.CharField(max_length=150)

    def __str__(self):
        return self.front

    class Meta:
        db_table = 'hs_decks'