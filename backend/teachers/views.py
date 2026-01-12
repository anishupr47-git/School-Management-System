from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from users.permission import IsTeacherRole
from academics.models import Enrollment,ExamMark,Attendance,Subject
from students.models import Student

@api_view(["GET"])
@permission_classes([IsTeacherRole])
def teacher_students(request):
    teacher=getattr(request.user,"teacher_profile",None)
    if not teacher:
        return Response({"detail":"Teacher profile not found for this user."},status=status.HTTP_400_BAD_REQUEST)
    subject_id=request.query_params.get("subject_id")
    if not subject_id:
        return Response({"detail":"subject_id is required."},status=status.HTTP_400_BAD_REQUEST)
    if not teacher.subjects.filter(id=subject_id).exists():
        return Response({"detail":"You are not assigned to this subject."},status=status.HTTP_403_FORBIDDEN)
    subject=Subject.objects.filter(id=subject_id).first()
    if not subject or not subject.classroom_id:
        return Response({"detail":"Subject classroom not found."},status=status.HTTP_400_BAD_REQUEST)
    enrollments=Enrollment.objects.select_related("student__user").filter(classroom_id=subject.classroom_id)
    student_ids=enrollments.values_list("student_id",flat=True).distinct()
    students=Student.objects.select_related("user").filter(id__in=student_ids)
    return Response([{"id":s.id,"username":s.user.username,"roll_number":s.roll_number,"batch":s.batch} for s in students])
