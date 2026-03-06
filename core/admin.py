from django.contrib import admin
from .models import Agendamento, User, Paciente, Profissional, Pagamento, Especialidade
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informações adicionais', {'fields':("tipo",'telefone','ativo')}),
    )
    list_display = ('username','email','tipo','ativo')
    list_filter = ('tipo','ativo')
    
admin.site.register(User, UserAdmin)
admin.site.register(Paciente)
admin.site.register(Profissional)
admin.site.register(Pagamento)
admin.site.register(Especialidade)
admin.site.register(Agendamento)


# No MESMO admin.py, DEPOIS dos registros existentes:

from .models import CategoriaRelatorio, RelatorioConfig  # importe os novos modelos

@admin.register(CategoriaRelatorio)
class CategoriaRelatorioAdmin(admin.ModelAdmin):
    list_display = ['nome', 'ordem', 'icone']
    list_editable = ['ordem']

@admin.register(RelatorioConfig)
class RelatorioConfigAdmin(admin.ModelAdmin):
    list_display = ['nome', 'categoria', 'slug', 'ativo']
    list_filter = ['categoria', 'ativo']
    search_fields = ['nome', 'descricao']
    prepopulated_fields = {'slug': ['nome']}
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('categoria', 'nome', 'descricao', 'slug', 'icone')
        }),
        ('Configuração', {
            'fields': ('filtros_disponiveis', 'query_sql', 'funcao_python'),
            'classes': ('wide',),
        }),
        ('Status', {
            'fields': ('ativo',)
        }),
    )