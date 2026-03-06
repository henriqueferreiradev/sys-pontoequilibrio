# Crie um arquivo: relatorios/management/commands/popular_relatorios.py

from django.core.management.base import BaseCommand
from core.models import CategoriaRelatorio, RelatorioConfig

class Command(BaseCommand):
    help = 'Popula relatórios iniciais'
    
    def handle(self, *args, **options):
        # Cria categorias
        categorias = [
            {'nome': 'PACIENTES', 'icone': 'fas fa-user-injured', 'ordem': 1},
            {'nome': 'PROFISSIONAIS', 'icone': 'fas fa-user-md', 'ordem': 2},
            {'nome': 'AGENDA', 'icone': 'fas fa-calendar-alt', 'ordem': 3},
            {'nome': 'FINANCEIRO', 'icone': 'fas fa-coins', 'ordem': 4},
        ]
        
        for cat in categorias:
            categoria, created = CategoriaRelatorio.objects.get_or_create(
                nome=cat['nome'],
                defaults={'icone': cat['icone'], 'ordem': cat['ordem']}
            )
            
            if created:
                self.stdout.write(f"Categoria criada: {categoria.nome}")
        
        self.stdout.write(self.style.SUCCESS('Relatórios populados com sucesso!'))