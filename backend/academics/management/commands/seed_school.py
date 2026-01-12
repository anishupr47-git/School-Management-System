from django.core.management.base import BaseCommand
from django.utils import timezone
from users.models import User
from teachers.models import Teacher
from students.models import Student
from academics.models import ClassRoom,Subject,Enrollment,ExamMark,Attendance
class Command(BaseCommand):
    def handle(self,*args,**kwargs):
        pwd="Password123!"
        
        # Create admin user
        admin_user,_=User.objects.get_or_create(username="admin",defaults={"role":"admin"})
        if not admin_user.check_password(pwd):
            admin_user.set_password(pwd)
        admin_user.role="admin"
        admin_user.save()
        
        classrooms=[]
        for g in range(1,11):
            c,_=ClassRoom.objects.get_or_create(name=f"Grade {g}")
            classrooms.append(c)
        subjects_by_class={}
        for c in classrooms:
            subs=[]
            for nm in ["English","Math","Science","Computer","Social","Nepali"]:
                s,_=Subject.objects.get_or_create(name=nm,classroom=c)
                subs.append(s)
            subjects_by_class[c.id]=subs
        dept_names=["English","Math","Science","Computer","Social","Nepali"]
        teachers=[]
        tcount=0
        for dept in dept_names:
            for i in range(1,6):
                tcount+=1
                uname=f"Teacher_{tcount}"
                u,_=User.objects.get_or_create(username=uname,defaults={"role":"teacher"})
                if not u.check_password(pwd):
                    u.set_password(pwd)
                u.role="teacher"
                u.save()
                emp=f"T{tcount:03d}"
                t,_=Teacher.objects.get_or_create(employee_id=emp,defaults={"user":u,"department":dept,"phone":""})
                if t.user_id!=u.id:
                    t.user=u
                    t.department=dept
                    t.save()
                teachers.append(t)
        for c in classrooms:
            subs=subjects_by_class[c.id]
            for idx,s in enumerate(subs):
                t=teachers[(idx*5)%len(teachers)]
                t.subjects.add(s)
        scount=0
        for c in classrooms:
            for i in range(1,41):
                scount+=1
                uname=f"Student_{scount}"
                u,_=User.objects.get_or_create(username=uname,defaults={"role":"student"})
                if not u.check_password(pwd):
                    u.set_password(pwd)
                u.role="student"
                u.save()
                roll=f"S{scount:04d}"
                s,_=Student.objects.get_or_create(roll_number=roll,defaults={"user":u,"batch":c.name,"date_of_birth":None})
                if s.user_id!=u.id:
                    s.user=u
                    s.batch=c.name
                    s.save()
                Enrollment.objects.get_or_create(student=s,classroom=c)
        today=timezone.now().date().isoformat()
        first_students=Student.objects.all()[:30]
        for s in first_students:
            c=ClassRoom.objects.filter(name=s.batch).first()
            if not c:
                continue
            subs=subjects_by_class.get(c.id,[])
            for sub in subs[:2]:
                ExamMark.objects.get_or_create(student=s,subject=sub,exam_type="quiz",defaults={"score":80,"date":today})
                Attendance.objects.get_or_create(student=s,subject=sub,date=today,defaults={"is_present":True})
        self.stdout.write(self.style.SUCCESS("seed complete"))
