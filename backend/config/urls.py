from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import protected_view,admin_overview,teacher_overview,student_overview,admin_stats,admin_students,admin_student_detail,admin_teachers,admin_teacher_detail,admin_classes,admin_class_detail,admin_subjects,admin_attendance_stats,admin_analytics
from academics.views import teacher_subjects,teacher_classes,teacher_class_students,teacher_add_marks,teacher_mark_attendance,student_marks,student_attendance_summary,student_attendance_detail
from aiapp.views import chat
def health_check(request):
    return JsonResponse({"status":"ok","service":"school-management-backend"})

urlpatterns = [
    path("admin/",admin.site.urls),

    path("api/health/",health_check),

    path("api/auth/token/",TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path("api/auth/token/refresh/",TokenRefreshView.as_view(),name="token_refresh"),

    path("api/protected/",protected_view),

    path("api/admin/overview/",admin_overview),
    path("api/admin/stats/",admin_stats),
    path("api/admin/attendance/",admin_attendance_stats),
    path("api/admin/analytics/",admin_analytics),
    path("api/admin/students/",admin_students),
    path("api/admin/students/<int:student_id>/",admin_student_detail),
    path("api/admin/teachers/",admin_teachers),
    path("api/admin/teachers/<int:teacher_id>/",admin_teacher_detail),
    path("api/admin/classes/",admin_classes),
    path("api/admin/classes/<int:class_id>/",admin_class_detail),
    path("api/admin/subjects/",admin_subjects),

    path("api/teacher/overview/",teacher_overview),
    path("api/teacher/subjects/",teacher_subjects),
    path("api/teacher/classes/",teacher_classes),
    path("api/teacher/classes/<int:classroom_id>/students/",teacher_class_students),
    path("api/teacher/marks/",teacher_add_marks),
    path("api/teacher/attendance/",teacher_mark_attendance),

    path("api/student/overview/",student_overview),
    path("api/student/marks/",student_marks),
    path("api/student/attendance-summary/",student_attendance_summary),
    path("api/student/attendance/",student_attendance_detail),

    path("api/ai/chat/",chat),
]
