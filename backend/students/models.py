from django.db import models
from users.models import User
class Student(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    roll_number = models.CharField(max_length=50, unique=True)
    batch = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.roll_number}"
