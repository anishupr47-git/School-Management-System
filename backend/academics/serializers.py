from rest_framework import serializers
from .models import ClassRoom, Subject, Attendance, ExamMark
from students.models import Student
class ClassRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ["id", "name", "section", "academic_year", "homeroom_teacher"]
class SubjectSerializer(serializers.ModelSerializer):
    classroom = ClassRoomSerializer(read_only=True)
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ["id", "name", "code", "classroom", "teacher_name"]

    def get_teacher_name(self, obj):
        if obj.teacher and obj.teacher.user:
            return obj.teacher.user.username
        return None
class StudentBriefSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ["id", "roll_number", "batch", "username", "full_name"]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class AttendanceSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    subject_code = serializers.CharField(source="subject.code", read_only=True)

    class Meta:
        model = Attendance
        fields = ["id", "date", "status", "subject", "subject_name", "subject_code"]
        read_only_fields = ["id", "subject_name", "subject_code"]


class MarkSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    subject_code = serializers.CharField(source="subject.code", read_only=True)
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = ExamMark
        fields = [
            "id",
            "subject",
            "subject_name",
            "subject_code",
            "exam_type",
            "score",
            "max_score",
            "date",
            "percentage",
        ]
        read_only_fields = ["id", "percentage", "subject_name", "subject_code"]

    def get_percentage(self, obj):
        if obj.max_score:
            return float(obj.score / obj.max_score * 100)
        return 0.0
