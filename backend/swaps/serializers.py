from rest_framework import serializers
from .models import SwapRequest

class SwapRequestSerializer(serializers.ModelSerializer):
    requester = serializers.ReadOnlyField(source='requester.username')

    class Meta:
        model = SwapRequest
        fields = [
            'id',
            'requester',
            'receiver',
            'skill_requested',
            'skill_offered',
            'status',
            'created_at'
        ]
        read_only_fields = ['status', 'created_at']
