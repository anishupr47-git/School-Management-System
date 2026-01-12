from django.contrib import admin
from .models import ClassRoom, Subject, Enrollment, Attendance, ExamMark
@admin.register(ClassRoom)
class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ("name", "section", "academic_year", "homeroom_teacher")
    list_filter = ("academic_year",)
    search_fields = ("name", "section")

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "classroom", "teacher")
    search_fields = ("name", "code")
    list_filter = ("classroom",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "classroom", "date_enrolled")
    list_filter = ("classroom",)
    search_fields = ("student__user__username",)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("student", "subject", "date", "is_present")
    list_filter = ("is_present", "date", "subject")
    search_fields = ("student__user__username",)


@admin.register(ExamMark)
class MarkAdmin(admin.ModelAdmin):
    list_display = ("student", "subject", "exam_type", "score", "max_score", "date")
    list_filter = ("exam_type", "subject")
    search_fields = ("student__user__username", "subject__name", "subject__code")
