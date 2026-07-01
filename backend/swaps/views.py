from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from skills.models import UserSkill,Skill
from .models import SwapRequest
from users.tasks import send_swap_request_notification

User = get_user_model()

# -----------------------------
# RECOMMENDATIONS VIEW
# -----------------------------
class RecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user

        my_wants = list(UserSkill.objects.filter(
            user=current_user, type="want"
        ).values_list("skill", flat=True))

        my_offers = list(UserSkill.objects.filter(
            user=current_user, type="offer"
        ).values_list("skill", flat=True))

        if not my_wants and not my_offers:
            return Response([])

        recommendations = []

        candidates = UserSkill.objects.filter(
            type="offer",
            skill__in=my_wants
        ).exclude(user=current_user)

        for offer in candidates:
            mutual = None
            if my_offers:
                mutual = UserSkill.objects.filter(
                    user=offer.user,
                    type="want",
                    skill__in=my_offers
                ).first()

            recommendations.append({
                "user_id": offer.user.id,
                "username": offer.user.username,
                "they_offer": offer.skill.name,
                "they_want": mutual.skill.name if mutual else None,
                "status": "mutual" if mutual else "open"
            })

        return Response(recommendations)

from django.db.models import Q
class AcceptedSwapsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        swaps = SwapRequest.objects.filter(
            Q(requester=request.user) | Q(receiver=request.user),
            status="accepted"
        )

        data = []
        for s in swaps:
            other_user = s.receiver if s.requester == request.user else s.requester
            if s.requester == request.user:
                skill_i_give = s.skill_offered.name
                skill_i_get = s.skill_requested.name
            else:
                skill_i_give = s.skill_requested.name
                skill_i_get = s.skill_offered.name

            data.append({
                "id": s.id,
                "my_username": request.user.username,
                "other_user": other_user.username,
                "other_user_id": other_user.id,
                "skill_i_give": skill_i_give,
                "skill_i_get": skill_i_get,
            })

        return Response(data)




# -----------------------------
# CREATE SWAP REQUEST (FIXED)
# -----------------------------
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from swaps.models import SwapRequest
from skills.models import Skill, UserSkill
from django.contrib.auth import get_user_model

User = get_user_model()

class CreateSwapRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        receiver_id = data.get("receiver")
        skill_requested_name = data.get("skill_requested")
        skill_offered_name = data.get("skill_offered")

        receiver = User.objects.get(id=receiver_id)

        skill_requested = Skill.objects.get(name=skill_requested_name)
        skill_offered = Skill.objects.get(name=skill_offered_name)

        # Receiver must OFFER what requester wants
        if not UserSkill.objects.filter(
            user=receiver, type="offer", skill=skill_requested
        ).exists():
            return Response({"error": "Receiver does not offer this skill"}, status=400)

        # Receiver must WANT what requester offers
        if not UserSkill.objects.filter(
            user=receiver, type="want", skill=skill_offered
        ).exists():
            return Response({"error": "Receiver does not want this skill"}, status=400)

        # Prevent duplicate request
        if SwapRequest.objects.filter(
            requester=request.user,
            receiver=receiver,
            skill_requested=skill_requested,
            skill_offered=skill_offered,
            status="pending"
        ).exists():
            return Response({"error": "Request already sent"}, status=400)

        swap_request = SwapRequest.objects.create(
            requester=request.user,
            receiver=receiver,
            skill_requested=skill_requested,
            skill_offered=skill_offered
        )

        requester_name = request.user.first_name or request.user.username

        send_swap_request_notification.delay(
            receiver.id,
            requester_name,
            swap_request.skill_offered.name,
            swap_request.skill_requested.name,
        )

        return Response({"success": "Swap request sent"})


  
# -----------------------------
# RESPOND TO SWAP REQUEST (✅ FIXED)
# -----------------------------
class RespondSwapRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, swap_id):
        action = request.data.get("action")

        try:
            swap = SwapRequest.objects.get(
                id=swap_id,
                receiver=request.user,
                status="pending"
            )
        except SwapRequest.DoesNotExist:
            return Response({"error": "Swap request not found"}, status=404)

        if action == "accept":
            # requester gives skill_offered
            UserSkill.objects.filter(
                user=swap.requester,
                type="offer",
                skill=swap.skill_offered
            ).delete()

            # receiver receives skill_requested
            UserSkill.objects.filter(
                user=swap.receiver,
                type="want",
                skill=swap.skill_requested
            ).delete()

            swap.status = "accepted"
            swap.save()

            return Response({"message": "Swap successful 🎉"})

        if action == "reject":
            swap.status = "rejected"
            swap.save()
            return Response({"message": "Swap rejected"})

        return Response({"error": "Invalid action"}, status=400)

# -----------------------------
# INCOMING SWAP REQUESTS
# -----------------------------
class IncomingSwapRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        swaps = SwapRequest.objects.filter(
            receiver=request.user,
            status="pending"
        )

        data = [
            {
                "id": s.id,
                "requester": s.requester.username,
                "skill_offered": s.skill_offered.name,
                "skill_requested": s.skill_requested.name,
            }
            for s in swaps
        ]

        return Response(data)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from skills.models import UserSkill

class SwapRecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user

        my_wants = UserSkill.objects.filter(
            user=current_user, type="want"
        ).values_list("skill", flat=True)

        my_offers = UserSkill.objects.filter(
            user=current_user, type="offer"
        ).values_list("skill", flat=True)

        if not my_wants or not my_offers:
            return Response([])

        recommendations = []

        candidates = UserSkill.objects.filter(
            type="offer",
            skill__in=my_wants
        ).exclude(user=current_user)

        for offer in candidates:
            mutual = UserSkill.objects.filter(
                user=offer.user,
                type="want",
                skill__in=my_offers
            ).first()

            if not mutual:
                continue

            recommendations.append({
                "user_id": offer.user.id,
                "username": offer.user.username,
                "they_offer": offer.skill.name,
                "they_want": mutual.skill.name,
                "status": "send"
            })

        return Response(recommendations)

from .models import SwapSession

class ProposeSessionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        swap_id = request.data.get("swap_id")
        date = request.data.get("date")
        time = request.data.get("time")
        duration = request.data.get("duration")

        try:
            swap = SwapRequest.objects.get(id=swap_id, status="accepted")
        except SwapRequest.DoesNotExist:
            return Response({"error": "Accepted swap request not found"}, status=404)

        if request.user != swap.requester and request.user != swap.receiver:
            return Response({"error": "Unauthorized"}, status=403)

        receiver = swap.requester if request.user == swap.receiver else swap.receiver

        session = SwapSession.objects.create(
            swap_request=swap,
            proposer=request.user,
            receiver=receiver,
            date=date,
            time=time,
            duration=duration
        )

        return Response({"success": "Session proposed", "session_id": session.id})

class IncomingSessionsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        sessions = SwapSession.objects.filter(receiver=request.user, status=SwapSession.PENDING)
        data = []
        for s in sessions:
            data.append({
                "id": s.id,
                "proposer": s.proposer.username,
                "date": s.date,
                "time": s.time,
                "duration": s.duration,
                "swap_id": s.swap_request.id
            })
        return Response(data)

class RespondSessionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, session_id):
        action = request.data.get("action")
        try:
            session = SwapSession.objects.get(id=session_id, receiver=request.user, status=SwapSession.PENDING)
        except SwapSession.DoesNotExist:
            return Response({"error": "Pending session not found"}, status=404)

        if action == "accept":
            session.status = SwapSession.SCHEDULED
            session.save()
            return Response({"message": "Session accepted"})
        elif action == "reject":
            session.status = SwapSession.REJECTED
            session.save()
            return Response({"message": "Session rejected"})
        return Response({"error": "Invalid action"}, status=400)

# class ScheduledSessionsView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         sessions = SwapSession.objects.filter(
#             Q(proposer=request.user) | Q(receiver=request.user),
#             status=SwapSession.SCHEDULED
#         )
#         data = []
#         for s in sessions:
#             other_user = s.receiver if s.proposer == request.user else s.proposer
#             data.append({
#                 "id": s.id,
#                 "other_user": other_user.username,
#                 "other_user_id": other_user.id,
#                 "date": s.date,
#                 "time": s.time,
#                 "duration": s.duration,
#                 "swap_id": s.swap_request.id,
#                 "is_proposer": s.proposer == request.user
#             })
#         return Response(data)

from .models import SessionRating

class ScheduledSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = SwapSession.objects.filter(
            Q(proposer=request.user) | Q(receiver=request.user),
            status__in=[SwapSession.SCHEDULED, SwapSession.COMPLETED]
        )

        data = []
        for s in sessions:
            other_user = s.receiver if s.proposer == request.user else s.proposer

            has_rated = SessionRating.objects.filter(
                session=s,
                reviewer=request.user
            ).exists()

            data.append({
                "id": s.id,
                "other_user": other_user.username,
                "other_user_id": other_user.id,
                "date": s.date,
                "time": s.time,
                "duration": s.duration,
                "status": s.status,
                "has_rated": has_rated,   # 🔥 IMPORTANT
            })

        return Response(data)

class CompleteSessionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, session_id):
        try:
            session = SwapSession.objects.get(
                id=session_id, 
                status=SwapSession.SCHEDULED
            )
            if request.user != session.proposer and request.user != session.receiver:
                return Response({"error": "Unauthorized"}, status=403)
                
            session.status = SwapSession.COMPLETED
            session.save()
            return Response({"message": "Session marked as completed"})
        except SwapSession.DoesNotExist:
            return Response({"error": "Scheduled session not found"}, status=404)
        

from .models import SwapSession, SessionRating

class GiveSessionRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        try:
            session = SwapSession.objects.get(
                id=session_id,
                status=SwapSession.COMPLETED
            )
        except SwapSession.DoesNotExist:
            return Response({"error": "Completed session not found"}, status=404)

        if request.user != session.proposer and request.user != session.receiver:
            return Response({"error": "Unauthorized"}, status=403)

        # Prevent double rating
        if SessionRating.objects.filter(session=session, reviewer=request.user).exists():
            return Response({"error": "You already rated this session"}, status=400)

        rating_value = request.data.get("rating")
        review_text = request.data.get("review", "")

        if not rating_value or not (1 <= int(rating_value) <= 5):
            return Response({"error": "Rating must be between 1 and 5"}, status=400)

        reviewee = session.receiver if request.user == session.proposer else session.proposer

        SessionRating.objects.create(
            session=session,
            reviewer=request.user,
            reviewee=reviewee,
            rating=rating_value,
            review=review_text
        )

        return Response({"message": "Rating submitted successfully ⭐"})