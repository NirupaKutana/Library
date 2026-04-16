from django.core.management.base import BaseCommand
from django.db import connection
from django.core.mail import send_mail

class Command(BaseCommand):
    help = "Daily membership reminder + expiry"

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:

            # 🔹 1. Get active users with remaining days
            cursor.execute("""
                SELECT um.user_id, u.user_email, (um.end_date - CURRENT_DATE) AS days_left
                FROM tbl_user_memberships um
                JOIN tbl_users u ON u.user_id = um.user_id
                WHERE um.status = 'Active'
            """)
            users = cursor.fetchall()

            # 🔹 2. Expire memberships (DB handles logic)
            cursor.execute("select sp_expire_memberships()")
        
        # 🔹 3. Send emails
        for user in users:
            print(user)
            email = user[1]
            days_left = user[2]

            if days_left > 0:
                # 📩 Reminder mail
                send_mail(
                    subject="Membership Expiry Reminder",
                    message=f"Your membership will expire in {days_left} days.",
                    from_email="kutananirupa@gmail.com",
                    recipient_list=[email],
                    fail_silently=True,
                )

            elif days_left == 0:
                # 📩 Last day mail
                send_mail(
                    subject="Membership Expiring Today",
                    message="Your membership expires today. Renew now to continue benefits.",
                    from_email="kutananirupa@gmail.com",
                    recipient_list=[email],
                    fail_silently=True,
                )

            elif days_left < 0:
                # 📩 Expired mail (optional)
                send_mail(
                    subject="Membership Expired",
                    message="Your membership has expired. Please renew.",
                    from_email="kutananirupa@gmail.com",
                    recipient_list=[email],
                    fail_silently=True,
                )

        # self.stdout.write("Daily membership job executed ✅")