# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GameState',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('energy', models.IntegerField(default=0)),
                ('food', models.IntegerField(default=0)),
                ('credits', models.IntegerField(default=0)),
                ('metal', models.IntegerField(default=0)),
                ('artifacts', models.IntegerField(default=0)),
                ('weapons', models.IntegerField(default=0)),
                ('biocomponents', models.IntegerField(default=0)),
                ('rareElements', models.IntegerField(default=0)),
                ('upgrades', models.CharField(default='0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', max_length=1000)),
                ('workers', models.CharField(default='0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.CharField(unique=True, max_length=32)),
                ('startDate', models.DateTimeField(verbose_name='First time played')),
                ('lastActiveDate', models.DateTimeField(verbose_name='Most recent time played')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='gamestate',
            name='player',
            field=models.ForeignKey(unique=True, to='spaceClicker.Player'),
            preserve_default=True,
        ),
    ]
