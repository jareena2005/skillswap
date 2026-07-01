from django.urls import path
from . import views

urlpatterns = [
    path("recommendations/", views.RecommendationsView.as_view(), name="recommendations"),
    path("create/", views.CreateSwapRequestView.as_view(), name="create"),
    path("respond/<int:swap_id>/", views.RespondSwapRequestView.as_view(), name="respond"),
    path("incoming/", views.IncomingSwapRequestsView.as_view(), name="incoming"),
    path("accepted/", views.AcceptedSwapsView.as_view(), name="accepted"),
    # Session Booking Endpoints
    path("session/propose/", views.ProposeSessionView.as_view(), name="propose_session"),
    path("session/incoming/", views.IncomingSessionsView.as_view(), name="incoming_sessions"),
    path("session/respond/<int:session_id>/", views.RespondSessionView.as_view(), name="respond_session"),
    path("session/scheduled/", views.ScheduledSessionsView.as_view(), name="scheduled_sessions"),
    path("session/complete/<int:session_id>/", views.CompleteSessionView.as_view(), name="complete_session"),
    path("session/rate/<int:session_id>/", views.GiveSessionRatingView.as_view(), name="rate_session"),
]

