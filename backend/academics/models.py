from django.db import models
from teachers.models import Teacher
from students.models import Student
class ClassRoom(models.Model):
    name = models.CharField(max_length=100)
    section = models.CharField(max_length=20, blank=True)
    academic_year = models.CharField(max_length=9)
    homeroom_teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="classes",
    )
    def __str__(self):
        if self.section:
            return f"{self.name} - {self.section} ({self.academic_year})"
        return f"{self.name} ({self.academic_year})"
class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    classroom = models.ForeignKey(
        ClassRoom,
        on_delete=models.CASCADE,
        related_name="subjects",
    )
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subjects",
    )

    def __str__(self):
        return f"{self.name} ({self.code})"


class Enrollment(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    classroom = models.ForeignKey(
        ClassRoom,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    date_enrolled = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "classroom")

    def __str__(self):
        return f"{self.student.user.username} -> {self.classroom}"


class Attendance(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="attendance_records",
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="attendance_records",
    )
    date = models.DateField()
    is_present = models.BooleanField(default=True)

    class Meta:
        unique_together = ("student", "subject", "date")

    def __str__(self):
        status = "Present" if self.is_present else "Absent"
        return f"{self.date} - {self.student.user.username} - {self.subject.code} - {status}"


class ExamMark(models.Model):
    EXAM_TYPE_CHOICES = (
        ("quiz", "Quiz"),
        ("midterm", "Mid-term"),
        ("final", "Final"),
        ("assignment", "Assignment"),
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="marks",
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="marks",
    )
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    date = models.DateField()

    class Meta:
        verbose_name_plural = "Marks"

    def __str__(self):
        return f"{self.student.user.username} - {self.subject.code} - {self.exam_type}: {self.score}/{self.max_score}"

    @property
    def percentage(self):
        if self.max_score:
            return float(self.score / self.max_score * 100)
        return 0.0
