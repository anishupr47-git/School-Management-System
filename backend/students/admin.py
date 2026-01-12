from django.contrib import admin
from .models import Student
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("user", "roll_number", "batch", "date_of_birth")
    search_fields = ("user__username", "roll_number")
