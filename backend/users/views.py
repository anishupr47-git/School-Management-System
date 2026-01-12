from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from students.models import Student
from teachers.models import Teacher
from academics.models import ClassRoom, Subject
from .permission import IsAdminRole, IsTeacherRole, IsStudentRole
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        "status": "ok",
        "message": "You are authenticated",
        "user": request.user.username,
        "role": request.user.role,
    })
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminRole])
def admin_overview(request):
    return Response({
        "page": "admin_overview",
        "message": "Only admins can access this endpoint."
    })
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsTeacherRole])
def teacher_overview(request):
    return Response({
        "page": "teacher_overview",
        "message": "Only teachers can access this endpoint."
    })
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudentRole])
def student_overview(request):
    return Response({
        "page": "student_overview",
        "message": "Only students can access this endpoint."
    })
from django.db.models import Count
from academics.models import ClassRoom, Subject
from students.models import Student
from teachers.models import Teacher
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_stats(request):
    data = {
        "students": Student.objects.count(),
        "teachers": Teacher.objects.count(),
        "classes": ClassRoom.objects.count(),
        "subjects": Subject.objects.count(),
    }
    return Response(data)
@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_students(request):
    students = Student.objects.select_related("user").all()
    data = [
        {
            "id": s.id,
            "username": s.user.username,
            "roll_number": s.roll_number,
            "batch": s.batch,
        }
        for s in students
    ]
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_student_detail(request, student_id):
    try:
        student = Student.objects.select_related("user").get(id=student_id)
        from academics.models import ExamMark, Attendance
        
        # Get marks
        marks = ExamMark.objects.filter(student=student).select_related("subject")
        marks_data = [
            {
                "subject": m.subject.name,
                "exam_type": m.exam_type,
                "score": float(m.score),
            }
            for m in marks
        ]
        
        # Get attendance
        attendance_records = Attendance.objects.filter(student=student).select_related("subject")
        attendance_data = [
            {
                "subject": a.subject.name,
                "date": str(a.date),
                "is_present": a.is_present,
            }
            for a in attendance_records
        ]
        
        # Calculate attendance summary
        total_attendance = attendance_records.count()
        present_count = attendance_records.filter(is_present=True).count()
        attendance_percentage = round((present_count / total_attendance * 100), 2) if total_attendance > 0 else 0
        
        data = {
            "id": student.id,
            "username": student.user.username,
            "first_name": student.user.first_name,
            "last_name": student.user.last_name,
            "email": student.user.email,
            "roll_number": student.roll_number,
            "batch": student.batch,
            "date_of_birth": student.date_of_birth,
            "marks": marks_data,
            "attendance": attendance_data,
            "attendance_summary": {
                "total": total_attendance,
                "present": present_count,
                "absent": total_attendance - present_count,
                "percentage": attendance_percentage,
            }
        }
        return Response(data)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_teachers(request):
    teachers = Teacher.objects.select_related("user").all()
    data = [
        {
            "id": t.id,
            "username": t.user.username,
        }
        for t in teachers
    ]
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_teacher_detail(request, teacher_id):
    try:
        teacher = Teacher.objects.select_related("user").get(id=teacher_id)
        data = {
            "id": teacher.id,
            "username": teacher.user.username,
            "first_name": teacher.user.first_name,
            "last_name": teacher.user.last_name,
            "email": teacher.user.email,
            "employee_id": teacher.employee_id,
            "department": teacher.department,
            "phone": teacher.phone,
        }
        return Response(data)
    except Teacher.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)
@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_classes(request):
    classrooms = ClassRoom.objects.all()
    data = [
        {
            "id": c.id,
            "name": str(c),
        }
        for c in classrooms
    ]
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_class_detail(request, class_id):
    try:
        classroom = ClassRoom.objects.get(id=class_id)
        from academics.models import Enrollment
        students = Student.objects.filter(enrollments__classroom=classroom).select_related("user").distinct()
        students_data = [
            {
                "id": s.id,
                "username": s.user.username,
                "roll_number": s.roll_number,
                "batch": s.batch,
            }
            for s in students
        ]
        data = {
            "id": classroom.id,
            "name": str(classroom),
            "section": classroom.section,
            "academic_year": classroom.academic_year,
            "homeroom_teacher": classroom.homeroom_teacher.user.username if classroom.homeroom_teacher else None,
            "students": students_data,
        }
        return Response(data)
    except ClassRoom.DoesNotExist:
        return Response({"error": "Class not found"}, status=404)

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_subjects(request):
    subjects = Subject.objects.all()
    data = [
        {
            "id": s.id,
            "name": str(s),
        }
        for s in subjects
    ]
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_attendance_stats(request):
    from academics.models import Attendance
    total_attendance = Attendance.objects.count()
    present = Attendance.objects.filter(is_present=True).count()
    absent = total_attendance - present if total_attendance > 0 else 0
    percentage = round((present / total_attendance) * 100, 2) if total_attendance > 0 else 0
    return Response({
        "total": total_attendance,
        "present": present,
        "absent": absent,
        "percentage": percentage
    })

@api_view(["GET"])
@permission_classes([IsAdminRole])
def admin_analytics(request):
    from academics.models import ExamMark, Attendance
    from django.db.models import Avg
    
    total_marks = ExamMark.objects.count()
    avg_score = ExamMark.objects.aggregate(avg=Avg('score'))['avg'] or 0
    total_attendance = Attendance.objects.count()
    attendance_percentage = round((Attendance.objects.filter(is_present=True).count() / total_attendance * 100), 2) if total_attendance > 0 else 0
    
    # Get marks by exam type
    marks_by_type = []
    exam_types = ['quiz', 'midterm', 'final', 'assignment']
    for exam_type in exam_types:
        count = ExamMark.objects.filter(exam_type=exam_type).count()
        avg = ExamMark.objects.filter(exam_type=exam_type).aggregate(avg=Avg('score'))['avg'] or 0
        marks_by_type.append({
            "type": exam_type.capitalize(),
            "count": count,
            "average": round(avg, 2)
        })
    
    # Get student count by batch
    students_by_batch = []
    from django.db.models import Q
    classrooms = ClassRoom.objects.all()
    for classroom in classrooms:
        count = Student.objects.filter(batch=classroom.name).count()
        students_by_batch.append({
            "batch": classroom.name,
            "count": count
        })
    
    return Response({
        "total_marks": total_marks,
        "average_score": round(avg_score, 2),
        "total_attendance": total_attendance,
        "attendance_percentage": attendance_percentage,
        "marks_by_type": marks_by_type,
        "students_by_batch": students_by_batch
    })

