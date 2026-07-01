from rest_framework import serializers
from .models import Skill, UserSkill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category']

class UserSkillSerializer(serializers.ModelSerializer):
    skill_id = serializers.IntegerField(write_only=True, required=False)
    skill_name = serializers.CharField(write_only=True, required=False)
    category = serializers.CharField(write_only=True, required=False, allow_blank=True)
    skill = SkillSerializer(read_only=True)
    skill_category = serializers.CharField(source='skill.category', read_only=True)

    class Meta:
        model = UserSkill
        fields = [
            'id',
            'skill',
            'skill_id',
            'skill_name',
            'category',
            'skill_category',
            'type',
            'experience_level',
            'availability',
            'description',
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        type_ = validated_data['type']
        category = validated_data.get('category', '')
        experience_level = validated_data.get('experience_level', 'beginner')
        availability = validated_data.get('availability', 'flexible')
        description = validated_data.get('description', '')

        skill_id = validated_data.get('skill_id')
        skill_name = validated_data.get('skill_name')

        if skill_id:
            skill_obj = Skill.objects.get(id=skill_id)
        elif skill_name:
            skill_obj, created = Skill.objects.get_or_create(
                name=skill_name,
                defaults={'category': category}
            )
            if category and not skill_obj.category:
                skill_obj.category = category
                skill_obj.save(update_fields=['category'])
        else:
            raise serializers.ValidationError("Either skill_id or skill_name must be provided.")

        return UserSkill.objects.create(
            user=user,
            skill=skill_obj,
            type=type_,
            experience_level=experience_level,
            availability=availability,
            description=description,
        )
