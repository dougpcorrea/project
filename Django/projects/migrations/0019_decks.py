# Generated by Django 4.1.3 on 2023-05-29 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0018_alter_cards_front'),
    ]

    operations = [
        migrations.CreateModel(
            name='Decks',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('deck', models.CharField(max_length=150)),
            ],
            options={
                'db_table': 'hs_decks',
            },
        ),
    ]
