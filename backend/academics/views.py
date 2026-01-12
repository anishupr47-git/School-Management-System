from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count,Q
from users.permission import IsTeacherRole,IsStudentRole
from academics.models import Enrollment,ExamMark,Attendance,Subject,ClassRoom
from students.models import Student

@api_view(["GET"])
@permission_classes([IsTeacherRole])
def teacher_subjects(request):
    teacher=getattr(request.user,"teacher_profile",None)
    if not teacher:
        return Response({"detail":"Teacher profile not found for this user."},status=status.HTTP_400_BAD_REQUEST)
    subjects=teacher.subjects.all()
    return Response([{"id":s.id,"name":s.name,"classroom_id":getattr(s,"classroom_id",None)} for s in subjects])

@api_view(["GET"])
@permission_classes([IsTeacherRole])
def teacher_classes(request):
    teacher=getattr(request.user,"teacher_profile",None)
    if not teacher:
        return Response({"detail":"Teacher profile not found for this user."},status=status.HTTP_400_BAD_REQUEST)
    classroom_ids=teacher.subjects.values_list("classroom_id",flat=True).distinct()
    classes=ClassRoom.objects.filter(id__in=classroom_ids)
    return Response([{"id":c.id,"name":getattr(c,"name",str(c))} for c in classes])

@api_view(["GET"])
@permission_classes([IsTeacherRole])
def teacher_class_students(request,classroom_id):
    teacher=getattr(request.user,"teacher_profile",None)
    if not teacher:
        return Response({"detail":"Teacher profile not found for this user."},status=status.HTTP_400_BAD_REQUEST)
    allowed=teacher.subjects.filter(classroom_id=classroom_id).exists()
    if not allowed:
        return Response({"detail":"You do not have access to this class."},status=status.HTTP_403_FORBIDDEN)
    enrollments=Enrollment.objects.select_related("student__user").filter(classroom_id=classroom_id)
    student_ids=enrollments.values_list("student_id",flat=True).distinct()
    students=Student.objects.select_related("user").filter(id__in=student_ids)
    return Response([{"id":s.id,"username":s.user.username,"roll_number":s.roll_number,"batch":s.batch} for s in students])

@api_view(["POST"])
@permission_classes([IsTeacherRole])
def teacher_add_marks(request):
    teacher=getattr(request.user,"teacher_profile",None)
    if not teacher:
        return Response({"detail":"Teacher profile not found for this user."},status=status.HTTP_400_BAD_REQUEST)
    student_id=request.data.get("student_id")
    subject_id=request.data.get("subject_id")
    exam_type=request.data.get("exam_type")
    score=request.data.get("score")
    date=request.data.get("date")
    if not student_id or not subject_id or not exam_type or score is None or not date:
        return Response({"detail":"student_id, subject_id, exam_type, score, date required."},status=status.HTTP_400_BAD_REQUEST)
    if not teacher.subjects.filter(id=subject_id).exists():
        return Response({"detail":"You are not assigned to this subject."},status=status.HTTP_403_FORBIDDEN)
    try:
        score=float(score)
    except:
        return Response({"detail":"score must be a number."},status=status.HTTP_400_BAD_REQUEST)
    mark=ExamMark.objects.create(student_id=student_id,subject_id=subject_id,exam_type=exam_type,score=score,date=date)
    return Response({"id":mark.id,"detail":"Mark added."},status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsTeacherRole])
def teacher_mark_attendance(request):
    teacher=getattr(request.user,"teacher_profile",None)
    if not teacher:
        return Response({"detail":"Teacher profile not found for this user."},status=status.HTTP_400_BAD_REQUEST)
    student_id=request.data.get("student_id")
    subject_id=request.data.get("subject_id")
    date=request.data.get("date")
    present=request.data.get("present")
    if not student_id or not subject_id or not date or present is None:
        return Response({"detail":"student_id, subject_id, date, present required."},status=status.HTTP_400_BAD_REQUEST)
    if not teacher.subjects.filter(id=subject_id).exists():
        return Response({"detail":"You are not assigned to this subject."},status=status.HTTP_403_FORBIDDEN)
    is_present=True if str(present).lower() in ["true","1","yes"] else False
    attendance=Attendance.objects.create(student_id=student_id,subject_id=subject_id,date=date,is_present=is_present)
    return Response({"id":attendance.id,"detail":"Attendance marked."},status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsStudentRole])
def student_marks(request):
    student=getattr(request.user,"student_profile",None)
    if not student:
        return Response({"detail":"Student profile not found."},status=status.HTTP_400_BAD_REQUEST)
    marks=ExamMark.objects.select_related("subject").filter(student_id=student.id).order_by("-date","-id")
    data=[]
    for m in marks:
        data.append({"id":m.id,"subject_id":m.subject_id,"subject":getattr(m.subject,"name",""),"exam_type":m.exam_type,"score":m.score,"date":str(m.date)})
    return Response(data)

@api_view(["GET"])
@permission_classes([IsStudentRole])
def student_attendance_summary(request):
    student=getattr(request.user,"student_profile",None)
    if not student:
        return Response({"detail":"Student profile not found."},status=status.HTTP_400_BAD_REQUEST)
    qs=Attendance.objects.filter(student_id=student.id)
    total=qs.count()
    present=qs.filter(is_present=True).count()
    percent=0
    if total>0:
        percent=round((present/total)*100,2)
    return Response({"total":total,"present":present,"absent":total-present,"percentage":percent})

@api_view(["GET"])
@permission_classes([IsStudentRole])
def student_attendance_detail(request):
    student=getattr(request.user,"student_profile",None)
    if not student:
        return Response({"detail":"Student profile not found."},status=status.HTTP_400_BAD_REQUEST)
    subject_id=request.query_params.get("subject_id")
    qs=Attendance.objects.select_related("subject").filter(student_id=student.id).order_by("-date","-id")
    if subject_id:
        qs=qs.filter(subject_id=subject_id)
    data=[]
    for a in qs:
        data.append({"id":a.id,"subject_id":a.subject_id,"subject":getattr(a.subject,"name",""),"date":str(a.date),"is_present":a.is_present})
    return Response(data)
