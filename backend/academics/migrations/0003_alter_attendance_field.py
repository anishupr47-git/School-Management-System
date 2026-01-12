# Generated migration

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0002_rename_mark_exammark'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attendance',
            name='status',
        ),
        migrations.AddField(
            model_name='attendance',
            name='is_present',
            field=models.BooleanField(default=True),
        ),
    ]
