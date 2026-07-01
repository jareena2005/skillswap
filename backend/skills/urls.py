from django.urls import path
from .views import SkillListView, UserSkillView, UserSkillDeleteView, TeachSkillView

urlpatterns = [
    path('', SkillListView.as_view()),       # /api/skills/
    path('me/', UserSkillView.as_view()),    # /api/skills/me/
    path('me/full/', TeachSkillView.as_view()),
    path('me/delete/', UserSkillDeleteView.as_view()), # /api/skills/me/delete/
]
