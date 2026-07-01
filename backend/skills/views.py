from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Skill, UserSkill
from .serializers import SkillSerializer, UserSkillSerializer


# -----------------------------
# LIST ALL SKILLS
# -----------------------------
class SkillListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        skills = Skill.objects.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    def post(self, request):
        name = request.data.get("name")
        if not name:
            return Response(
                {"error": "Skill name required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        skill, _ = Skill.objects.get_or_create(name=name.lower())
        serializer = SkillSerializer(skill)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# -----------------------------
# USER SKILLS (ADD, NOT DELETE)
# -----------------------------
class UserSkillView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        offer_names = UserSkill.objects.filter(
            user=request.user,
            type="offer"
        ).values_list("skill__name", flat=True)

        want_names = UserSkill.objects.filter(
            user=request.user,
            type="want"
        ).values_list("skill__name", flat=True)

        offer_details = UserSkillSerializer(
            UserSkill.objects.filter(user=request.user, type="offer"),
            many=True
        ).data
        want_details = UserSkillSerializer(
            UserSkill.objects.filter(user=request.user, type="want"),
            many=True
        ).data

        return Response({
            "offer": list(offer_names),
            "want": list(want_names),
            "offer_details": offer_details,
            "want_details": want_details,
        })

    def post(self, request):
        offer = request.data.get("offer", [])
        want = request.data.get("want", [])

        if not offer or not want:
            return Response(
                {"error": "Both offer and want skills are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        for skill_name in offer:
            skill, _ = Skill.objects.get_or_create(name=skill_name.lower())
            UserSkill.objects.get_or_create(
                user=request.user,
                skill=skill,
                type="offer"
            )

        for skill_name in want:
            skill, _ = Skill.objects.get_or_create(name=skill_name.lower())
            UserSkill.objects.get_or_create(
                user=request.user,
                skill=skill,
                type="want"
            )

        return Response(
            {"message": "Skills added successfully"},
            status=status.HTTP_201_CREATED
        )


class TeachSkillView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        offer_skills = UserSkill.objects.filter(user=request.user, type=UserSkill.OFFER)
        want_skills = UserSkill.objects.filter(user=request.user, type=UserSkill.WANT)

        return Response({
            "offer": UserSkillSerializer(offer_skills, many=True).data,
            "want": UserSkillSerializer(want_skills, many=True).data,
        })

    def post(self, request):
        offer = request.data.get("offer", [])
        want = request.data.get("want", [])
        description = request.data.get("description", "")

        if not isinstance(offer, list) or not isinstance(want, list):
            return Response(
                {"error": "Offer and want must be arrays."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not offer or not want:
            return Response(
                {"error": "Add at least one teaching and one learning skill."},
                status=status.HTTP_400_BAD_REQUEST
            )

        def normalize_item(item, type_):
            if isinstance(item, str):
                return {
                    "skill_name": item,
                    "type": type_,
                    "category": "",
                    "experience_level": "beginner",
                    "availability": "flexible",
                    "description": description,
                }
            return {
                "skill_name": item.get("skill_name") or item.get("name"),
                "type": type_,
                "category": item.get("category", ""),
                "experience_level": item.get("experience_level", "beginner"),
                "availability": item.get("availability", "flexible"),
                "description": item.get("description", description),
            }

        def save_or_update_skill(payload):
            skill_name = payload["skill_name"].lower()
            category = payload.get("category", "")
            skill, _ = Skill.objects.get_or_create(
                name=skill_name,
                defaults={"category": category}
            )
            if category and not skill.category:
                skill.category = category
                skill.save(update_fields=["category"])

            user_skill, created = UserSkill.objects.get_or_create(
                user=request.user,
                skill=skill,
                type=payload["type"],
                defaults={
                    "experience_level": payload["experience_level"],
                    "availability": payload["availability"],
                    "description": payload["description"],
                }
            )

            if not created:
                changed = False
                if user_skill.experience_level != payload["experience_level"]:
                    user_skill.experience_level = payload["experience_level"]
                    changed = True
                if user_skill.availability != payload["availability"]:
                    user_skill.availability = payload["availability"]
                    changed = True
                if payload.get("description") and user_skill.description != payload["description"]:
                    user_skill.description = payload["description"]
                    changed = True
                if changed:
                    user_skill.save(update_fields=["experience_level", "availability", "description"])

        for item in offer:
            payload = normalize_item(item, UserSkill.OFFER)
            save_or_update_skill(payload)

        for item in want:
            payload = normalize_item(item, UserSkill.WANT)
            save_or_update_skill(payload)

        return Response(
            {"message": "Skills saved successfully."},
            status=status.HTTP_201_CREATED
        )


# skills/views.py - Add DELETE endpoint
class UserSkillDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        skill_name = request.data.get('skill_name')
        type_ = request.data.get('type')
        
        UserSkill.objects.filter(
            user=request.user, 
            skill__name=skill_name, 
            type=type_
        ).delete()
        
        return Response({"message": "Skill removed"})



