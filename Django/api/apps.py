from django.apps import AppConfig
import threading
import requests
import sys
import time

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        if 'runserver' in sys.argv:
            threading.Thread(target=self.iniciar_calentamiento_ia).start()

    def iniciar_calentamiento_ia(self):
        time.sleep(3)
        from django.conf import settings
        print("\n🔥 [OPTIMIZACIÓN] Iniciando pre-carga de Llama 3.2...")
        
        try:
            base_url = getattr(settings, 'OLLAMA_API_URL', '').replace("/api/generate", "")
            if base_url.endswith("/"): base_url = base_url[:-1]
            chat_url = f"{base_url}/api/chat"

            payload = {
                "model": "llama3.2", # Coincide con views.py
                "messages": [{"role": "user", "content": "ping"}],
                "stream": False,
                "keep_alive": "60m", 
                "options": {"num_ctx": 1024}
            }
            
            headers = {"ngrok-skip-browser-warning": "true"}
            
            # Timeout corto, solo para despertar
            try:
                requests.post(chat_url, json=payload, headers=headers, timeout=5)
                print("✅ [OPTIMIZACIÓN] Señal enviada. IA cargando en RAM.\n")
            except requests.exceptions.ReadTimeout:
                print("✅ [OPTIMIZACIÓN] Señal recibida (Timeout esperado).\n")
                
        except Exception as e:
            print(f"⚠️ [AVISO] No se pudo despertar a la IA: {str(e)}")
