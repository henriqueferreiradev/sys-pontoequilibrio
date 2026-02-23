from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse

class SessionExpiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Verificar se o usuário NÃO está autenticado mas tem cookie de sessão
        if not request.user.is_authenticated and request.COOKIES.get('sessionid'):
            # Verificar se a URL atual NÃO é a de login e se a sessão expirou
            if request.path != reverse('login'):
                messages.warning(request, "Sua sessão foi encerrada por inatividade. Faça login novamente para continuar.")
                # Adicionar um parâmetro na URL para forçar a exibição do modal
                return redirect(f"{reverse('login')}?session_expired=1")
        
        return self.get_response(request)