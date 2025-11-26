from django.apps import AppConfig
import threading
import requests
import sys
import time

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Solo ejecutamos si es el servidor principal (runserver)
        if 'runserver' in sys.argv:
            threading.Thread(target=self.iniciar_calentamiento_ia).start()

    def iniciar_calentamiento_ia(self):
        time.sleep(3) # Esperamos que cargue la configuración
        from django.conf import settings
        
        print("\n🔥 [SISTEMA] Iniciando pre-carga de IA en memoria RAM...")
        
        try:
            # Limpieza de URL para evitar errores
            base_url = getattr(settings, 'OLLAMA_API_URL', '').replace("/api/generate", "").replace("/api/chat", "")
            if base_url.endswith("/"): base_url = base_url[:-1]
            chat_url = f"{base_url}/api/chat"

            # Payload "Despertador"
            payload = {
                "model": "llama3.2:1b", # Modelo Rápido
                "messages": [{"role": "user", "content": "ping"}],
                "stream": False,
                "keep_alive": "60m",    # Mantiene la IA viva 1 hora
                "options": {"num_ctx": 1024}
            }
            
            # Timeout corto, solo para despertar
            try:
                requests.post(chat_url, json=payload, timeout=5)
                print("✅ [SISTEMA] Señal enviada. La IA está lista y optimizada.\n")
            except requests.exceptions.ReadTimeout:
                print("✅ [SISTEMA] La IA está despertando (Timeout esperado).\n")
            except Exception as e:
                print(f"⚠️ [AVISO] La IA no respondió al ping: {e}")

        except Exception as e:
            print(f"⚠️ [ERROR] Fallo en auto-warmup: {str(e)}")
