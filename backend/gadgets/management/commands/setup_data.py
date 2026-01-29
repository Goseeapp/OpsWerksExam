"""Management command to set up initial data with properly hashed passwords."""
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from gadgets.models import Gadget


class Command(BaseCommand):
    help = 'Set up initial users and gadgets with proper password hashing'

    def handle(self, *args, **options):
        # Create users with properly hashed passwords
        user1, created1 = User.objects.get_or_create(
            username='juandelacruz',
            defaults={
                'email': 'juan@example.com',
                'first_name': 'Juan',
                'last_name': 'Dela Cruz',
            }
        )
        if created1:
            user1.set_password('password123')
            user1.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user1.username}'))
        else:
            self.stdout.write(f'User already exists: {user1.username}')

        user2, created2 = User.objects.get_or_create(
            username='mariaclarita',
            defaults={
                'email': 'maria@example.com',
                'first_name': 'Maria',
                'last_name': 'Clarita',
            }
        )
        if created2:
            user2.set_password('password123')
            user2.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user2.username}'))
        else:
            self.stdout.write(f'User already exists: {user2.username}')

        # Create gadgets
        gadget1, g_created1 = Gadget.objects.get_or_create(
            name='Smart Watch Pro',
            owner=user1,
            defaults={
                'description': 'A premium smartwatch with health monitoring, GPS tracking, and 7-day battery life.',
            }
        )
        if g_created1:
            self.stdout.write(self.style.SUCCESS(f'Created gadget: {gadget1.name}'))

        gadget2, g_created2 = Gadget.objects.get_or_create(
            name='Wireless Earbuds X1',
            owner=user1,
            defaults={
                'description': 'Noise-cancelling wireless earbuds with crystal clear audio and 24-hour battery.',
            }
        )
        if g_created2:
            self.stdout.write(self.style.SUCCESS(f'Created gadget: {gadget2.name}'))

        gadget3, g_created3 = Gadget.objects.get_or_create(
            name='Portable Charger Max',
            owner=user2,
            defaults={
                'description': '20000mAh portable charger with fast charging support for all devices.',
            }
        )
        if g_created3:
            self.stdout.write(self.style.SUCCESS(f'Created gadget: {gadget3.name}'))

        self.stdout.write(self.style.SUCCESS('Data setup complete!'))
