# Generated by Django 4.1.7 on 2023-03-16 14:49

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0002_alter_researchpaper_research_paper_name_rank_like'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='researchpaper',
            name='License',
        ),
        migrations.RemoveField(
            model_name='researchpaper',
            name='Submission_Length',
        ),
        migrations.RemoveField(
            model_name='researchpaper',
            name='Submission_number',
        ),
        migrations.AlterField(
            model_name='researchpaper',
            name='Abstract',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='researchpaper',
            name='Authors',
            field=models.ManyToManyField(blank=True, related_name='Authors', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='researchpaper',
            name='Code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='researchpaper',
            name='Public_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='researchpaper',
            name='Research_Paper_file',
            field=models.FileField(blank=True, null=True, upload_to='uploads/'),
        ),
    ]