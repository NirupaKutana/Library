from django.core.management.base import BaseCommand
from django.db import connection
from django.core.mail import send_mail

class Command(BaseCommand):
    help = "Expire memberships and send email"

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:

            # 🔥 Get users whose membership will expire
            cursor.execute("""
                SELECT um.user_id, u.user_email
                FROM tbl_user_memberships um
                JOIN tbl_users u ON u.user_id = um.user_id
                WHERE um.end_date < CURRENT_DATE AND um.status = 'Active'
            """)
            users = cursor.fetchall()
            print(users)
            # 🔥 Expire memberships
            cursor.execute("SELECT sp_expire_memberships()")

        # 🔥 Send email
        for user in users:
            email = user[1]
            print(email)
            send_mail(
                subject="Membership Expired",
                message="Your membership has expired. Please renew.",
                from_email="kutananirupa@gmail.com",
                recipient_list=[email],
                fail_silently=True,
            )

        # self.stdout.write("Memberships expired & emails sent ✅")