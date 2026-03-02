


from datetime import datetime

from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from openpyxl import Workbook
from datetime import datetime
from django.http import HttpResponse
from libApp.service import Audit_service
# from .middlewares.jwt_middleware import JWTAuthenticationMiddleware
from reportlab.platypus import SimpleDocTemplate , Table,TableStyle,Paragraph ,Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from rest_framework.permissions import AllowAny
from reportlab.lib.units import inch

# ---------------------------------------ChartView-------------------------------------------------------------

class ChartViewList(APIView):
    def get(self,request):
        data = Audit_service.get_datafor_chart()
        return Response(data,status=status.HTTP_200_OK)
    
# ---------------------------------------XLSX ReportView-------------------------------------------------------------

class UserReportView(APIView):
    def get(self,request,id):
        
        wb = Workbook()
        ws = wb.active
        ws.title = "User Reposrt"
        headers =[
            "issue_id",
            "user name",
            "book name",
            "issue_date",
            "duedate",
            "return date",
            "status"
        ]
        ws.append(headers)
        rows=Audit_service.get_user_report(id)
        for row in rows :
            ws.append([
                row[0],
                row[1],
                row[2],
                row[3].strftime('%Y-%m-%d') if row[3] else "",
                row[4].strftime('%Y-%m-%d') if row[4] else "",
                row[5].strftime('%Y-%m-%d') if row[5] else "",
                row[6]
                ])
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=User_Report.xlsx'
        wb.save(response)
        
        return response

# ---------------------------------------Audit tView-------------------------------------------------------------

class AuditListView(APIView):
    def get(self,request):
        data = Audit_service.get_audit_log()
        return Response(data,status=status.HTTP_200_OK)
    
class LoginAuditListView(APIView):
    def get(self,request):
        data = Audit_service.get_login_audit()     
        return Response(data,status=status.HTTP_200_OK)
    
class SearchUserLoginAuditView(APIView):
    def get(self,request):
        name = request.GET.get("name","")
        data=Audit_service.get_Search_user_audit(name)
        return Response(data,status=status.HTTP_200_OK)

class UserAuditPDFView(APIView):
    
    permission_classes = [AllowAny]
    def get(self,request):
        email = request.GET.get("email","")
       
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="User_Login_Audit_{email}.pdf"'
        # response['Content-Disposition']=f'inline;filename="user_audit.pdf"'

        doc = SimpleDocTemplate(response,pagesize=A4,rightMargin=30,leftMargin=30,
            topMargin=40, bottomMargin=30)
        elements = []

        style = getSampleStyleSheet()
        # ===== Custom Styles =====
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=style['Heading1'],
            fontSize=18,
            spaceAfter=6,
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=style['Normal'],
            fontSize=10,
        )
        # ===== Header Section =====
        elements.append(Paragraph("Library Management System", title_style))
        elements.append(Paragraph("User Login Audit Report", style['Heading3']))
        elements.append(Spacer(1, 12))

        elements.append(Paragraph(f"<b>User Email:</b> {email}", normal_style))
        elements.append(Paragraph(
            f"<b>Generated On:</b> {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}",
            normal_style
        ))
        elements.append(Spacer(1, 20))


        data = Audit_service.get_user_audit(email)
        table_data =[["id" ,"Email", "User name", "Activity", "Status", "Date"]]

        

        for d in data :
            date_formate = d[5].strftime("%d %b %Y") if d[5] else ""
            table_data.append([
                str(d[0]),
                d[1],d[2] if d[2] else "",
                d[3],d[4],
                date_formate
            ])
        table = Table(table_data,repeatRows=1)
        # ===== Professional Table Styling =====
        table.setStyle(TableStyle([

            # Header Styling
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#34495E")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Times-Bold'),

            # Body Styling
            ('FONTNAME', (0, 1), (-1, -1), 'Times-Roman'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),

            # Alternating Row Colors
            ('ROWBACKGROUNDS', (0, 1), (-1, -1),
             [colors.whitesmoke, colors.lightgrey]),

            # Grid
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),

            # Alignment
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),

            # Padding
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),

        ]))

        elements.append(table)
        # ===== Footer with Page Number =====
        def add_page_number(canvas, doc):
            page_num_text = f"Page {doc.page}"
            canvas.setFont("Helvetica", 9)
            canvas.drawRightString(550, 20, page_num_text)

        doc.build(elements,
                  onFirstPage=add_page_number,
                  onLaterPages=add_page_number)
        return response
    
class FilterAuditView(APIView):
     def get(self,request):
         sdate=request.GET.get('sdate')
         edate=request.GET.get('edate')
         user=request.GET.get('user')
         act=request.GET.get('act')
         sdate = sdate if sdate else None
         edate = edate if edate else None
         user = user if user else None
         act = act if act else None
         
         data=Audit_service.get_filter_audit(sdate,edate,user,act)
         return Response(data)

class FilterAuditPDFview(APIView):
    def get(self,request):
        sdate = request.GET.get('sdate')
        edate = request.GET.get('edate')
        user = request.GET.get('user')
        act = request.GET.get('act')

        sdate = sdate if sdate else None
        edate = edate if edate else None
        user = int(user) if user else None
        act = act if act else None

        data = Audit_service.get_filter_audit(sdate, edate, user, act)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="Audit_Report.pdf"'

        doc = SimpleDocTemplate(response, pagesizev=A4)
        elements = []

        styles = getSampleStyleSheet()
        title = Paragraph("<b>Audit Report</b>",styles["Title"])
        elements.append(title)
        elements.append(Spacer(1,0.3*inch))
        table_data =[ ["ID", "User", "Action", "Module", "Description", "Date"]]
        for row in data:
            table_data.append([
                row[0],
                row[1],
                row[2].upper(),
                row[3],
                row[4],
                row[5].strftime("%d %b %Y %H:%M")
            ])

        table = Table(table_data, repeatRows=1)

        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ]))

        elements.append(table)
        def add_page_number(canvas, doc):
            page_num_text = f"Page {doc.page}"
            canvas.setFont("Helvetica", 9)
            canvas.drawRightString(550, 20, page_num_text)

        doc.build(elements ,onFirstPage=add_page_number,
                  onLaterPages=add_page_number)

        return response