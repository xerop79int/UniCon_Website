from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.

class ForgetPassword(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    otp = models.IntegerField(blank=True,null=True)

class Venue(models.Model):
    title = models.CharField(max_length=300, name='Venue_name')
    subtitle = models.CharField(max_length=300, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateField(auto_now_add=True, null=True)
    github = models.URLField(max_length=200, null=True, blank=True)
    email = models.EmailField(max_length=100, null=True, blank=True)
    website = models.CharField(max_length=300, null=True)

    def __str__(self):
        return self.Venue_name
    #OfficialReviwer = models.ForeignKey(OfficialReviwer, on_delete=models.CASCADE, null=True, blank=True)

class OfficialReviwer(models.Model):
    User = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    Official_Reviewer_name = models.CharField(max_length=100)
    Venue = models.ForeignKey(Venue, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return self.User.username

class ResearchPaper(models.Model):
    Venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    Research_Paper_name = models.CharField(max_length=300)
    Research_Paper_file = models.FileField(upload_to='uploads/', null=True, blank=True)
    Isapproved = models.BooleanField(default=False)
    Public_date = models.DateTimeField(auto_now_add=True, null=True)
    visibility = models.options = (
        ('public', 'Public'),
        ('private', 'Private'),
    )
    Visibility = models.CharField(max_length=10, choices=visibility, default='public')
    Code = models.CharField(max_length=100, null=True, blank=True)
    Abstract = models.TextField(null=True, blank=True)
    rating = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.Research_Paper_name

class Author(models.Model):
    ResearchPaper = models.ForeignKey(ResearchPaper, on_delete=models.CASCADE)
    User = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.User.username
    
class Comments(models.Model):
    ResearchPaper = models.ForeignKey(ResearchPaper, on_delete=models.CASCADE)
    User = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    Comment = models.TextField()
    Comment_date = models.DateTimeField(auto_now_add=True),
    visibility = models.options = (
        ('public', 'Public'),
        ('private', 'Private'),
    )
    Visibility = models.CharField(max_length=10, choices=visibility, default='public')
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return self.ResearchPaper.Research_Paper_name

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    Paper = models.ForeignKey(ResearchPaper, on_delete=models.CASCADE, null=True, blank=True)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.body

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Comments, on_delete=models.CASCADE)
    value = models.CharField(max_length=10, choices=(('Like', 'Like'), ('Unlike', 'Unlike')))

    def __str__(self):
        return str(self.post)

class Rank(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rank = models.IntegerField(default=0)

class Notifications(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.message

class Subscribe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username